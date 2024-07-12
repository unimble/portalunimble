import CheckList from "../components/CheckList";
import CollorPicker from "../components/CollorPicker";
import DateHourPicker from "../components/DateHourPicker";
import DatePicker from "../components/DatePicker";
import Email from "../components/Email";
import File from "../components/File";
import ImageUpload from "../components/ImageUpload";
import Number from "../components/Number";
import Password from "../components/Password";
import RadioList from "../components/RadioList";
import Range from "../components/Range";
import RichText from "../components/RichText";
import Search from "../components/Search";
import ShowImage from "../components/ShowImage";
import Text from "../components/Text";

export default [
    {
        id: 1,
        component: <CollorPicker />,
        name: "CollorPicker",
    },
    {
        id: 2,
        component: <CheckList />,
        name: "CheckList",
    },
    {
        id: 3,
        component: <RadioList />,
        name: "RadioList",
    },
    {
        id: 4,
        component: <DatePicker />,
        name: "Data",
    },
    {
        id: 5,
        component: <DateHourPicker />,
        name: "Data e Hora",
    },
    {
        id: 6,
        component: <Email />,
        name: "Email",
    },
    {
        id: 7,
        component: <Text />,
        name: "Texto"
    },
    {
        id: 8,
        component: <Password />,
        name: "Senha"
    },
    {
        id: 9,
        component: <Number />,
        name: "Numero"
    },
    {
        id: 10,
        component: <File />,
        name: "Arquivo"
    },
    {
        id: 11,
        component: <ImageUpload />,
        name: "Upload de imagem"
    },
    {
        id: 12,
        component: <Range />,
        name: "Range"
    },
    {
        id: 13,
        component: <Search />,
        name: "Busca"
    },
    {
        id: 14,
        component: <RichText />,
        name: "Rich Text"
    },
    {
        id: 15,
        component: <ShowImage />,
        name: "Imagem"
    },
]