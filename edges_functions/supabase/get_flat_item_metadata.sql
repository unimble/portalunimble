Need to install the following packages:
supabase@2.24.3
Ok to proceed? (y) [?25l
    Select a project:                                                                          
                                                                                               
  >  1. enrwqpgldrzrybbunzjz [name: bdunimble, org: ccaepxiblteyqvhrmelp, region: sa-east-1]   
    2. ksyvemvlvisdwejyjuce [name: ProjetoTeste, org: gppusjnzffnlkehknlvz, region: sa-east-1] 
    3. quwomrpdmbfefkdargwu [name: supatest, org: gppusjnzffnlkehknlvz, region: sa-east-1]     
    4. gzflemoxhzjewbrevjjm [name: ticketProject, org: gppusjnzffnlkehknlvz, region: sa-east-1]
                                                                                               
                                                                                               
                                                                                               
                                                                                               
                                                                                               
                                                                                               
                                                                                               
    ↑/k up • ↓/j down • / filter • q quit • ? more                                             
                                                                                               [0D[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[0D[2K [0D[2K[?25h[?1002l[?1003l[?1006l-- 1) Dropa a versão antiga (se houver)
drop function IF exists public.get_flat_item_metadata (bigint, bigint, text);

-- 2) Cria/substitui a função com a lógica corrigida
create or replace function public.get_flat_item_metadata (
  p_tipo_item_id bigint,
  p_user_id bigint,
  p_kind text -- '' | 'col' | 'company' | 'team'
) RETURNS table (
  item_id bigint,
  item_nome text,
  created_at timestamptz,
  criador bigint,
  criador_nome text,
  criador_avatar text,
  equipe bigint,
  equipe_id text,
  equipe_nome text,
  empresa bigint,
  parent_ids bigint[],
  elem_meta_instancia_ids bigint[],
  item_base bigint,
  data jsonb,
  dataId jsonb
) as $$
WITH RECURSIVE base_items AS (
  -- Apenas a instância principal é filtrada por "kind"
  SELECT i.*
  FROM "Item" i
  WHERE i.item = p_tipo_item_id
    AND (
         p_kind = '' 
      OR (p_kind = 'col'     AND i.criador = p_user_id)
      OR (p_kind = 'company' AND i.empresa = p_user_id)
      OR (p_kind = 'team'    AND i.equipe = p_user_id)
    )
),
item_tree_raw AS (
  -- Pega a principal + recursivamente filhos (sem filtrar por permissões)
  SELECT *, depende_de AS parent_ids
  FROM base_items
  UNION ALL
  SELECT i2.*, i2.depende_de
  FROM "Item" i2
  JOIN item_tree_raw it ON i2.id = ANY(it.depende_de)
),
item_tree AS (
  -- Remove duplicatas de itens com ROW_NUMBER()
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY id ORDER BY created_at DESC) AS rownum
  FROM item_tree_raw
)
-- Seleciona apenas a 1ª ocorrência de cada item
SELECT
  it.id                         AS item_id,
  ti.nome                       AS item_nome,
  it.created_at,
  it.criador,
  u.nome                        AS criador_nome,
  u.profile                  AS criador_avatar,
  it.equipe,
  eq.id                      AS equipe_id,
  eq.nome                      AS equipe_nome,
  it.empresa,
  it.depende_de                 AS parent_ids,
  it.elem                       AS elem_meta_instancia_ids,
  it.item                       AS item_base,
  (
    SELECT jsonb_object_agg(td.nomedodado, to_jsonb(d."Conteudo"))
    FROM "MetaInstancia" mi
    JOIN "MetaEstrutura" me ON me.id = mi."metaEstrutura"
    JOIN "TipoDeDado" td    ON td.id = me."dadoDependente"
    JOIN "Dado" d           ON d.id = mi.dado
    WHERE mi.id = ANY(it.elem)
  ) AS data,
  (
    SELECT jsonb_object_agg(td.nomedodado, to_jsonb(td.id))
    FROM "MetaInstancia" mi
    JOIN "MetaEstrutura" me ON me.id = mi."metaEstrutura"
    JOIN "TipoDeDado" td    ON td.id = me."dadoDependente"
    JOIN "Dado" d           ON d.id = mi.dado
    WHERE mi.id = ANY(it.elem)
  ) AS dataId
FROM item_tree it
LEFT JOIN "Colaborador" c ON c.id = it.criador
LEFT JOIN "Usuario" u ON u.id = c.usuario
LEFT JOIN "TipoDeItem" ti ON it.item = ti.id
LEFT JOIN "Equipe" eq ON it.equipe = eq.id
WHERE it.rownum = 1;
$$ LANGUAGE sql STABLE;
