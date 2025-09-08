import { response } from "./utils.ts";
import fieldTypes from "./fieldTypes.ts";
import * as TipoItemService from "../retaguarda/service/TipoDeItem.ts";

/*
Example
Conditional list = [
    {
      "label": "Igual",
      "value": "EQUAL"
    },
    {
      "label": "Diferente",
      "value": "DIFF"
    },
    {
      "label": "Maior que",
      "value": "GREATER_THAN"
    },
    {
      "label": "Maior ou igual a",
      "value": "GREATER_EQUAL"
    },
    {
      "label": "Menor que",
      "value": "LESS_THAN"
    },
    {
      "label": "Menor ou igual a",
      "value": "LESS_EQUAL"
    },
    {
      "label": "Começa com",
      "value": "STARTS_WITH"
    },
    {
      "label": "Termina com",
      "value": "ENDS_WITH"
    },
    {
      "label": "Contém",
      "value": "CONTAINS"
    }
  ]

FilterObj = [
  {
    field: 156 (Tipo dado Id)
    cond: EQUAL (check list above)
    value: 'Task' (Filter value)
  }
]

*/
const conditionalSwitch = [
  { key: "EQUAL", value: "=", include: (val) => val },
  { key: "DIFF", value: "!=", include: (val) => val },
  { key: "GREATER_THAN", value: ">", include: (val) => val },
  { key: "GREATER_EQUAL", value: ">=", include: (val) => val },
  { key: "LESS_THAN", value: "<", include: (val) => val },
  { key: "LESS_EQUAL", value: "<=", include: (val) => val },
  { key: "STARTS_WITH", value: "ILIKE", include: (val) => `${val}%` },
  { key: "CONTAINS", value: "ILIKE", include: (val) => `%${val}%` },
  { key: "ENDS_WITH", value: "ILIKE", include: (val) => `%${val}` }
];

class FilterResolver {
  private mountObj = [];
  private filterObj;
  private item;

  constructor(filterObj, item) {
    this.filterObj = filterObj;
    this.item = item;
  }

  public async resolver() {
    try {
      const fields = await this.getFields();
      if (!fields) return response(null, true, "Erro ao montar filtro");


      for (const filter of this.filterObj) {
        const fieldData = fields.estrutura.map(item => item.dadoDependente).filter(item => item != null);
        const [translateField] = fieldData.filter(item => item.id == filter.field);

        if (translateField && this.validateField(filter.value, translateField.campohtml)) {
          const conditional = conditionalSwitch.filter(item => item.key == filter.cond)[0];
          const formatedValue = this.formatValue(conditional, filter.value);
          const casting = this.formatCasting(translateField.campohtml);

          this.mountObj.push(`(data ->> '${translateField.nomedodado}') <> ''`);
          this.mountObj.push(`(data ->> '${translateField.nomedodado}') IS NOT NULL`);
          this.mountObj.push(`(data ->> '${translateField.nomedodado}')${casting} ${conditional.value} '${formatedValue}'${casting}`);
        }
      }

      const finalString = this.mountObj.join(' AND ');
      return response(finalString);
    } catch (e) {
      return response(e, true, "Erro ao montar filtro");
    }
  }

  private formatValue(cond, value) {
    let finalValue = value.replace(/'/g, "''");

    return cond.include(value);
  }

  private validateField(value, id) {
    const [type] = fieldTypes.filter(item => item.id == id);

    if (!type) return false;

    const regex = {
      "Date": /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
      "Number": /^-?\d+$/
    };

    if (!regex[type.type]) return true;

    return regex[type.type].test(value);
  }

  private formatCasting(id) {
    const [type] = fieldTypes.filter(item => item.id == id);

    if (!type) return "";
    
    const casting = {
      "Date": "::date",
      "Datetime": "::date",
      "Number": "::numeric"
    };

    if (!casting[type.type]) return "";

    return casting[type.type];
  }

  private async getFields() {
    const result = await TipoItemService.getItemFullStructureByNameExpand(this.item);

    if (!result) return false;

    return result;
  }
}

export default FilterResolver;
