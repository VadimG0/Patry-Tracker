"use client";
import {
    Box,
    Stack,
    Typography,
    Button,
    TextField,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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

const popupStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #EEE",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    borderRadius: "15px",
    color: "#EEE",
    bgcolor: "#222",
};

const textFieldStyle = {};

export default function Home() {
    const [pantry, setPantry] = useState([]);
    const [itemName, setItemName] = useState("");

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
            gap={2}
            bgcolor={"#222"}>
            <Box
                width="800px"
                height="100px"
                bgcolor={"#AD974F"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                borderRadius={"15px"}>
                <Typography variant={"h2"} color={"#EEE"} textAlign={"center"}>
                    Pantry Items
                </Typography>
            </Box>
            <Box
                border={"1px solid #EEE"}
                borderRadius={"15px"}
                overflow={"hidden"}>
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    bgcolor={"#EEE"}
                    paddingTop={2}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <SearchIcon sx={{ color: "#222", mr: 1, my: 0.5 }} />
                        <TextField
                            id="input-with-sx"
                            variant="outlined"
                            size="small"
                            placeholder="Search"
                        />
                    </Box>
                </Box>
                <Stack
                    width="800px"
                    height="400px"
                    spacing={2}
                    overflow={"auto"}
                    bgcolor={"#EEE"}
                    py={3}
                    pl={3}
                    sx={{
                        "&::-webkit-scrollbar": {
                            width: "24px",
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "#EEE",
                            padding: "10px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "#222",
                            borderRadius: "15px",
                            border: "7px solid transparent",
                            backgroundClip: "content-box",
                        },
                    }}>
                    {pantry.map(({ name, quantity }) => (
                        <Box
                            key={name}
                            width="100%"
                            minHeight="120px"
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            paddingX={7}
                            bgcolor={"#222"}
                            borderRadius={"15px"}>
                            <Typography
                                variant={"h5"}
                                color={"#EEE"}
                                textAlign={"center"}>
                                {name.charAt(0).toUpperCase() + name.slice(1)}
                            </Typography>
                            <Box
                                display={"flex"}
                                flexDirection={"column"}
                                alignItems={"center"}
                                gap={2}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        whiteSpace: "nowrap",
                                        bgcolor: "#EEE",
                                        color: "#222",
                                        "&:hover": {
                                            bgcolor: "#AD974F",
                                            color: "#EEE",
                                        },
                                    }}
                                    onClick={() => {
                                        removeItem(name);
                                    }}>
                                    Remove
                                </Button>
                                <Typography
                                    variant={"h7"}
                                    color={"#EEE"}
                                    textAlign={"center"}>
                                    Quantity: {quantity}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Box>
            <Box display={"flex"} gap={3} width={"600px"}>
                <TextField
                    id="outline-basic"
                    label="Item"
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "#EEE",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#EEE",
                            },
                        },
                        "& .MuiInputLabel-outlined": {
                            color: "#EEE",
                        },
                    }}
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />
                <Button
                    variant="contained"
                    sx={{
                        whiteSpace: "nowrap",
                        bgcolor: "#AD974F",
                        color: "#EEE",
                        "&:hover": {
                            bgcolor: "#EEE",
                            color: "#AD974F",
                        },
                    }}
                    onClick={() => {
                        addItem(itemName.toLowerCase());
                        setItemName("");
                    }}
                    aria-autocomplete="none">
                    Add Item
                </Button>
            </Box>
        </Box>
    );
}
