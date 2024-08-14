"use client";
import {
    Box,
    Stack,
    Typography,
    Button,
    TextField,
    InputAdornment,
    FormControl,
    MenuItem,
    FormHelperText,
    Select,
    InputLabel,
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

export default function Home() {
    const [pantry, setPantry] = useState([]);
    const [itemName, setItemName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sort, setSort] = useState("");
    const [order, setOrder] = useState("");

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

    const handleSortChange = (event) => {
        setSort(event.target.value);
    };

    const handleOrderChange = (event) => {
        setOrder(event.target.value);
    };

    const sortPantry = (items) => {
        const sortedItems = [...items];
        if (sort === "Alphabet") {
            sortedItems.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === "Quantity") {
            sortedItems.sort((a, b) => a.quantity - b.quantity);
        }

        if (order === "Ascending") {
            sortedItems.reverse();
        }

        return sortedItems.reverse();
    };

    const filteredPantry = sortPantry(
        pantry.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

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
                    justifyContent={"space-between"}
                    px={5}
                    bgcolor={"#EEE"}
                    py={2}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <SearchIcon sx={{ color: "#222", mr: 1, my: 0.5 }} />
                        <TextField
                            id="input-with-sx"
                            variant="outlined"
                            size="small"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "&.Mui-focused": {
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#222",
                                        },
                                    },
                                    "&:hover:not(.Mui-focused)": {
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#222",
                                        },
                                    },
                                },
                            }}
                        />
                    </Box>
                    <Box>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel
                                id="demo-simple-select-label"
                                sx={{
                                    "&.Mui-focused": {
                                        color: "#222",
                                    },
                                }}>
                                Sort
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={sort}
                                label="Sort"
                                onChange={handleSortChange}
                                sx={{
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor: "#222",
                                        },
                                }}>
                                <MenuItem value={"Alphabet"}>Alphabet</MenuItem>
                                <MenuItem value={"Quantity"}>Quantity</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel
                                id="demo-simple-select-label"
                                sx={{
                                    "&.Mui-focused": {
                                        color: "#222",
                                    },
                                }}>
                                Order
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={order}
                                label="Order"
                                onChange={handleOrderChange}
                                sx={{
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor: "#222",
                                        },
                                }}>
                                <MenuItem value={"Ascending"}>
                                    Ascending
                                </MenuItem>
                                <MenuItem value={"Descending"}>
                                    Descending
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Stack
                    width="800px"
                    height="400px"
                    spacing={2}
                    overflow={"auto"}
                    bgcolor={"#EEE"}
                    paddingBottom={3}
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
                    {filteredPantry.map(({ name, quantity }) => (
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
                            "&.Mui-focused": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#AD974F",
                                },
                            },
                            "&:hover:not(.Mui-focused)": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#AD974F",
                                },
                            },
                        },
                        "& .MuiInputLabel-outlined": {
                            color: "#EEE",
                            "&.Mui-focused": {
                                color: "#AD974F",
                            },
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
                    autoComplete="off">
                    Add Item
                </Button>
            </Box>
        </Box>
    );
}
