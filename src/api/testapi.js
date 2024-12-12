import { useEffect, useState } from 'react';
import axios from 'axios';

function MyComponent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item._id}>
              <p>ID: {item.id}</p>
              <p>Name: {item.name}</p>
              <p>Description: {item.des}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyComponent;
