export default function CheckList() {
    return (
        <>
            <ul style={{ listStyle: "none", margin:0, padding:0 }}>
                <li style={{ display: "flex", alignItems: "center", columnGap: "15px" }}><input type="checkbox" style={{ width: "20px" }} /> Item 1</li>
                <li style={{ display: "flex", alignItems: "center", columnGap: "15px" }}><input type="checkbox" style={{ width: "20px" }} /> Item 2</li>
                <li style={{ display: "flex", alignItems: "center", columnGap: "15px" }}><input type="checkbox" style={{ width: "20px" }} /> Item 3</li>
            </ul>
        </>
    )
}