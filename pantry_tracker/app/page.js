"use client";
import {
    Box,
    Stack,
    Typography,
    Button,
    Modal,
    TextField,
} from "@mui/material";
import { firestore } from "@/app/firebase";
import {
    collection,
    getDocs,
    query,
    setDoc,
    doc,
    deleteDoc,
    getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
};

export default function Home() {
    const [pantry, setPantry] = useState([]);
    const [open, setOpen] = useState(false);
    const [itemName, setItemName] = useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const updatePantry = async () => {
        try {
            const snapshot = query(collection(firestore, "Pantry"));
            const docsSnapshot = await getDocs(snapshot);
            const pantryList = [];
            docsSnapshot.forEach((doc) => {
                pantryList.push({ name: doc.id, ...doc.data() });
            });
            console.log(pantryList);
            setPantry(pantryList);
        } catch (error) {
            console.error("Error fetching pantry items:", error);
        }
    };

    useEffect(() => {
        updatePantry();
    }, []);

    const addItem = async (item) => {
        const docRef = doc(collection(firestore, "Pantry"), item);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const { quantity } = docSnap.data();
            await setDoc(docRef, { quantity: quantity + 1 });
        } else {
            await setDoc(docRef, { quantity: 1 });
        }
        await updatePantry();
    };

    const removeItem = async (item) => {
        const docRef = doc(collection(firestore, "Pantry"), item);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const { quantity } = docSnap.data();
            if (quantity === 1) {
                await deleteDoc(docRef);
            } else {
                await setDoc(docRef, { quantity: quantity - 1 });
            }
        }
        await updatePantry();
    };

    return (
        <Box
            width="100vw"
            height="100vh"
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            gap={2}>
            <Button variant="contained" onClick={handleOpen}>
                Add Item
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2">
                        Add Item
                    </Typography>
                    <Stack direction={"row"} spacing={2}>
                        <TextField
                            id="outline-basic"
                            label="Item"
                            variant="outlined"
                            fullWidth
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            onClick={() => {
                                addItem(itemName);
                                setItemName("");
                                handleClose();
                            }}>
                            Add
                        </Button>
                    </Stack>
                </Box>
            </Modal>
            <Box border={"1px solid #333"}>
                <Box
                    width="800px"
                    height="100px"
                    bgcolor={"#333"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}>
                    <Typography
                        variant={"h2"}
                        color={"#EEE"}
                        textAlign={"center"}>
                        Pantry Items
                    </Typography>
                </Box>
                <Stack
                    width="800px"
                    height="400px"
                    spacing={2}
                    overflow={"auto"}>
                    {pantry.map(({ name, quantity }) => (
                        <Box
                            key={name}
                            width="100%"
                            minHeight="150px"
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            paddingX={7}
                            bgcolor={"#f0f0f0"}>
                            <Typography
                                variant={"h3"}
                                color={"#333"}
                                textAlign={"center"}>
                                {name.charAt(0).toUpperCase() + name.slice(1)}
                            </Typography>
                            <Typography
                                variant={"h3"}
                                color={"#333"}
                                textAlign={"center"}>
                                Quantity: {quantity}
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    removeItem(name);
                                }}>
                                Remove
                            </Button>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}
