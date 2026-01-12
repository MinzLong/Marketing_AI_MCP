import Card from "../components/common/Card.jsx";
import TextInput from "../components/forms/TextInput.jsx";
import useHello from "../hooks/useHello.js";

export default function HomePage() {
  const { name, setName, message, status } = useHello();

  return (
    <Card>
      <div className="field">
        <TextInput
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Type your name"
        />
      </div>
      <div className={`message ${status}`}>{message}</div>
    </Card>
  );
}
