CREATE OR REPLACE FUNCTION public.get_flat_item_metadata_allteams(
  p_tipo_item_id     bigint,
  p_user_id          bigint,
  p_limit            integer DEFAULT 50,
  p_offset           integer DEFAULT 0,
  p_campo_id         text DEFAULT NULL,
  p_responsavel_id   bigint DEFAULT NULL
)
RETURNS TABLE(
  item_id bigint,
  item_nome text,
  created_at timestamp with time zone,
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
  dataid jsonb
)
LANGUAGE sql
STABLE
AS $function$
WITH RECURSIVE

  teams AS (
    SELECT id FROM "Equipe" WHERE p_user_id = ANY("Equipe".colaboradores)
  ),

  root_items AS (
    SELECT
      i.*,
      i.depende_de AS parent_ids
    FROM "Item" i
    WHERE i.item = p_tipo_item_id
      AND i.equipe IN (SELECT id FROM teams)
    ORDER BY i.created_at DESC
  ),

  item_tree_raw AS (
    SELECT * FROM root_items

    UNION ALL

    SELECT
      i2.*,
      i2.depende_de AS parent_ids
    FROM "Item" i2
    JOIN item_tree_raw it
      ON i2.id = ANY(it.parent_ids)
  ),

  item_tree AS (
    SELECT *,
           ROW_NUMBER() OVER (
             PARTITION BY id
             ORDER BY created_at DESC
           ) AS rownum
    FROM item_tree_raw
  ),

  final AS (
    SELECT
      it.id                         AS item_id,
      ti.nome                       AS item_nome,
      it.created_at,
      it.criador,
      u.nome                        AS criador_nome,
      u.profile                     AS criador_avatar,
      it.equipe,
      eq.id                         AS equipe_id,
      eq.nome                       AS equipe_nome,
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
      ) AS dataid
    FROM item_tree it
    LEFT JOIN "Colaborador" c ON c.id = it.criador
    LEFT JOIN "Usuario"     u ON u.id = c.usuario
    LEFT JOIN "TipoDeItem"  ti ON it.item = ti.id
    LEFT JOIN "Equipe"      eq ON it.equipe = eq.id
    WHERE it.rownum = 1
  )

SELECT *
FROM final
WHERE
  p_campo_id IS NULL
  OR (final.data ->> p_campo_id) = p_responsavel_id::text
ORDER BY final.created_at DESC
LIMIT p_limit
OFFSET p_offset;
$function$;

-- select * from get_flat_item_metadata_allteams(108, 50, 50, 0, 'Responsável'::Text, 145)