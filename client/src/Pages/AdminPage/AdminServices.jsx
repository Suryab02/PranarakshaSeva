import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./adminServices.css";

function AdminServices(props) {
  const [bloodTypes, setBloodTypes] = useState([
    { name: "O+", quantity: null },
    { name: "O-", quantity: null },
    { name: "A+", quantity: null },
    { name: "A-", quantity: null },
    { name: "B+", quantity: null },
    { name: "B-", quantity: null },
    { name: "AB+", quantity: null },
    { name: "AB-", quantity: null }
  ]);

  async function getBloodCount() {
    const response = await axios.get(`/bloodcount/?bank=${props.bankname.data}`);
    return response.data;
  }

  async function updateBloodCount(name, quantity) {
    await axios.post(`/bloodcount/?bank=${props.bankname.data}`, { name, count: quantity });
  }

  async function deleteBloodCount(name) {
    console.log(name)
    await axios.post(`/delete/?bank=${props.bankname.data}`,{name:name});
    return 1;
  }

  const handleChange = (event, index) => {
    const newBloodTypes = [...bloodTypes];
    newBloodTypes[index].quantity = parseInt(event.target.value) || null;
    setBloodTypes(newBloodTypes);
  };

  const updateCount = async (index) => {
    const newBloodTypes = [...bloodTypes];
    await updateBloodCount(newBloodTypes[index].name, newBloodTypes[index].quantity);
    setBloodTypes(newBloodTypes);
    console.log(newBloodTypes);
  };
  
  const handleKeyPress = (event, index) => {
    if (event.key === "Enter") {
      updateCount(bloodTypes[index].name, bloodTypes[index].quantity);
    }
  };
 
  const handleFocus = (event) => event.target.select();

  const deleteBloodType = async (index) => {
    const newBloodTypes = [...bloodTypes];
    console.log(newBloodTypes[index].name)
    await deleteBloodCount(newBloodTypes[index].name);
    newBloodTypes[index].quantity = 0;
    setBloodTypes(newBloodTypes);
    getBloodCount().then((data) => setBloodTypes(data));
  };

  useEffect(() => {
    getBloodCount().then((data) => setBloodTypes(data));
  }, [props.bankname.data]);

  return (
    <div className="admin-services">
      <div className="right">
        <div className="admin-buttons">
         
        </div>
    <div className="admin-services-list">
      <h2>{props.bankname.data}  Blood Inventory</h2>
      <table>
        <thead>
          <tr>
            <th>Blood Type</th>
            <th>Quantity (in ml)</th>
            <th>Update</th>
            <th>Delete</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {bloodTypes.map((bloodType, index) => (
            <tr key={index}>
              <td>{bloodType.name}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={bloodType.quantity || ""}
                 onChange={(event) => handleChange(event, index)}
                 // onKeyPress={(event) => handleKeyPress(event, index)}
                 // onFocus={handleFocus}
                />
              </td>
              <td>
                <button
                  className="update-button"
                  disabled={!bloodType.quantity}
                  onClick={() => updateCount(index)}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </td>
              <td>
                <button
                  className="delete-button"
                  disabled={!bloodType.quantity}
                  onClick={() => deleteBloodType(index)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
              <td>
                {bloodType.city}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
);
}

export default AdminServices;