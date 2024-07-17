import { useEffect, useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";
import useConfirmationAlert from "../composables/useConfirmationAlert";

type GeneralItem = {
  id: number;
  name: string;
  quantity: string;
  price: number;
};

const GeneralItems: React.FC = () => {
  const [editItem, setEditItem] = useState<GeneralItem | undefined>();
  const [inputName, setInputName] = useState("");
  const [inputQuantity, setInputQuantity] = useState("");
  const [inputPrice, setInputPrice] = useState<number | undefined>();
  const [items, setItems] = useState<Array<GeneralItem>>();

  const { performSQLAction, initialized } = useSQLiteDB();
  const { showConfirmationAlert, ConfirmationAlert } = useConfirmationAlert();

  useEffect(() => {
    if (initialized) {
      loadData();
    }
  }, [initialized]);

  const loadData = async () => {
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const respSelect = await db?.query(`SELECT * FROM general_items`);
        setItems(respSelect?.values);
      });
    } catch (error) {
      alert((error as Error).message);
      setItems([]);
    }
  };

  const updateItem = async () => {
    try {
      performSQLAction(
        async (db: SQLiteDBConnection | undefined) => {
          await db?.query(
            `UPDATE general_items SET name=?, quantity=?, price=? WHERE id=?`,
            [
              inputName,
              inputQuantity,
              inputPrice,
              editItem?.id,
            ]
          );

          const respSelect = await db?.query(`SELECT * FROM general_items;`);
          setItems(respSelect?.values);
        },
        async () => {
          resetInputs();
        }
      );
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const addItem = async () => {
    try {
      performSQLAction(
        async (db: SQLiteDBConnection | undefined) => {
          await db?.query(
            `INSERT INTO general_items (name, quantity, price) values (?,?,?);`,
            [inputName, inputQuantity, inputPrice]
          );

          const respSelect = await db?.query(`SELECT * FROM general_items;`);
          setItems(respSelect?.values);
        },
        async () => {
          resetInputs();
        }
      );
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const confirmDelete = (itemId: number) => {
    showConfirmationAlert("Are You Sure You Want To Delete This Item?", () => {
      deleteItem(itemId);
    });
  };

  const deleteItem = async (itemId: number) => {
    try {
      performSQLAction(
        async (db: SQLiteDBConnection | undefined) => {
          await db?.query(`DELETE FROM general_items WHERE id=?;`, [itemId]);

          const respSelect = await db?.query(`SELECT * FROM general_items;`);
          setItems(respSelect?.values);
        }
      );
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const doEditItem = (item: GeneralItem | undefined) => {
    if (item) {
      setEditItem(item);
      setInputName(item.name);
      setInputQuantity(item.quantity);
      setInputPrice(item.price);
    } else {
      resetInputs();
    }
  };

  const resetInputs = () => {
    setEditItem(undefined);
    setInputName("");
    setInputQuantity("");
    setInputPrice(undefined);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>General Items</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonItem>
          <IonLabel>Name</IonLabel>
          <IonInput
            type="text"
            value={inputName}
            onIonInput={(e) => setInputName(e.target.value as string)}
          />
        </IonItem>
        <IonItem>
          <IonLabel>Quantity</IonLabel>
          <IonInput
            type="text"
            value={inputQuantity}
            onIonInput={(e) => setInputQuantity(e.target.value as string)}
          />
        </IonItem>
        <IonItem>
          <IonLabel>Price (Rs.)</IonLabel>
          <IonInput
            type="number"
            value={inputPrice}
            onIonInput={(e) => setInputPrice(Number(e.target.value))}
          />
        </IonItem>
        {editItem ? (
          <>
            <IonButton onClick={() => doEditItem(undefined)}>CANCEL</IonButton>
            <IonButton onClick={updateItem}>UPDATE</IonButton>
          </>
        ) : (
          <IonButton onClick={addItem} disabled={!inputName || !inputQuantity || inputPrice === undefined}>
            ADD
          </IonButton>
        )}

        <h3>General Items Data</h3>

        {items?.map((item) => (
          <IonItem key={item.id}>
            <IonLabel className="ion-text-wrap">
              {item.name} - {item.quantity} - {item.price}
            </IonLabel>
            <IonButton onClick={() => doEditItem(item)}>EDIT</IonButton>
            <IonButton onClick={() => confirmDelete(item.id)}>DELETE</IonButton>
          </IonItem>
        ))}

        {ConfirmationAlert}
      </IonContent>
    </IonPage>
  );
};

export default GeneralItems;