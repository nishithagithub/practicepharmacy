import {
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToast,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import "./Home.css";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";
import useConfirmationAlert from "../composables/useConfirmationAlert";

type MedicineItem = {
  id: number;
  name: string;
  type: string;
  quantity: string;
  expiry_date: string;
  batch_no: string;
  price: number;
};

const Home: React.FC = () => {
  const [editItem, setEditItem] = useState<MedicineItem | undefined>();
  const [inputName, setInputName] = useState("");
  const [inputType, setInputType] = useState("");
  const [inputQuantity, setInputQuantity] = useState("");
  const [inputExpiryDate, setInputExpiryDate] = useState("");
  const [inputBatchNo, setInputBatchNo] = useState("");
  const [inputPrice, setInputPrice] = useState<number | undefined>();
  const [items, setItems] = useState<Array<MedicineItem>>();
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

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
        const respSelect = await db?.query(`SELECT * FROM medicines`);
        setItems(respSelect?.values);
      });
    } catch (error) {
      alert((error as Error).message);
      setItems([]);
    }
  };

  const updateItem = async () => {
    try {
      await performSQLAction(
        async (db: SQLiteDBConnection | undefined) => {
          await db?.query(
            `UPDATE medicines SET name=?, type=?, quantity=?, expiry_date=?, batch_no=?, price=? WHERE id=?`,
            [
              inputName,
              inputType,
              inputQuantity,
              inputExpiryDate,
              inputBatchNo,
              inputPrice,
              editItem?.id,
            ]
          );

          const respSelect = await db?.query(`SELECT * FROM medicines;`);
          setItems(respSelect?.values);
        },
        () => {
          // On Success
          setToastMessage("Data updated successfully.");
          setShowToast(true);
          resetInputs();
        },
        (error) => {
          // On Error
          setToastMessage(`Error: ${error.message}`);
          setShowToast(true);
        }
      );
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const addItem = async () => {
    performSQLAction(
      async (db: SQLiteDBConnection | undefined) => {
        await db?.query(
          `INSERT INTO medicines (name, type, quantity, expiry_date, batch_no, price) VALUES (?,?,?,?,?,?);`,
          [inputName, inputType, inputQuantity, inputExpiryDate, inputBatchNo, inputPrice]
        );

        const respSelect = await db?.query(`SELECT * FROM medicines;`);
        setItems(respSelect?.values);
      },
      () => {
        // On Success
        setToastMessage("Data added successfully.");
        setShowToast(true);
        resetInputs();
      },
      (error) => {
        // On Error
        setToastMessage(`Error: ${error.message}`);
        setShowToast(true);
      }
    );
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
          await db?.query(`DELETE FROM medicines WHERE id=?;`, [itemId]);

          const respSelect = await db?.query(`SELECT * FROM medicines;`);
          setItems(respSelect?.values);
        },
        () => {
          // On Success
          setToastMessage("Data deleted successfully.");
          setShowToast(true);
        },
        (error) => {
          // On Error
          setToastMessage(`Error: ${error.message}`);
          setShowToast(true);
        }
      );
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const doEditItem = (item: MedicineItem | undefined) => {
    if (item) {
      setEditItem(item);
      setInputName(item.name);
      setInputType(item.type);
      setInputQuantity(item.quantity);
      setInputExpiryDate(item.expiry_date);
      setInputBatchNo(item.batch_no);
      setInputPrice(item.price);
    } else {
      resetInputs();
    }
  };

  const resetInputs = () => {
    setEditItem(undefined);
    setInputName("");
    setInputType("");
    setInputQuantity("");
    setInputExpiryDate("");
    setInputBatchNo("");
    setInputPrice(undefined);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>REACT SQLITE</IonTitle>
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
          <IonLabel>Type</IonLabel>
          <IonSelect
            value={inputType}
            placeholder="Select One"
            onIonChange={(e) => setInputType(e.detail.value)}
          >
            <IonSelectOption value="strip">Strip</IonSelectOption>
            <IonSelectOption value="tube">Tube</IonSelectOption>
            <IonSelectOption value="powder">Powder</IonSelectOption>
            <IonSelectOption value="liquid">Liquid</IonSelectOption>
          </IonSelect>
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
          <IonLabel>Expiry Date</IonLabel>
          <IonInput
            type="date"
            value={inputExpiryDate}
            onIonInput={(e) => setInputExpiryDate(e.target.value as string)}
          />
        </IonItem>
        <IonItem>
          <IonLabel>Batch No</IonLabel>
          <IonInput
            type="text"
            value={inputBatchNo}
            onIonInput={(e) => setInputBatchNo(e.target.value as string)}
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
          <IonButton onClick={addItem} disabled={!inputName || !inputType || !inputQuantity || !inputExpiryDate || !inputBatchNo || inputPrice === undefined}>
            ADD
          </IonButton>
        )}

        <h3>THE SQLITE DATA</h3>

        {items?.map((item) => (
          <IonItem key={item.id}>
            <IonLabel className="ion-text-wrap">
              {item.name} - {item.type} - {item.quantity} - {item.expiry_date} - {item.batch_no} - {item.price}
            </IonLabel>
            <IonButton onClick={() => doEditItem(item)}>EDIT</IonButton>
            <IonButton onClick={() => confirmDelete(item.id)}>DELETE</IonButton>
          </IonItem>
        ))}

        {ConfirmationAlert}

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
