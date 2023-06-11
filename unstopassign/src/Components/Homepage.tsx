import {
  Box,
  Stack,
  Grid,
  Heading,
  Text,
 
  Button,
  VStack,
  useToast,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Seat from "./Seat";
import bgImage from "../Images/bgImage.png";
import Tickets from "./Tickets";
export interface Seats {
  seatNumber: number;
  isBooked: boolean;
}
const Homepage = () => {
  const [allSeats, setAllSeats] = useState<Seats[]>([]);
  const [ticket, setTicket] = useState<string[]>([]);
  const [value, setValue] = useState<string>("");
  const [load, setLoad] = useState<boolean>(false);
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

// This function is created for fetching all seats details.
  let getAllSeats = async () => {
    try {
      let res = await axios.get(
        `https://assignmentbackend-2yf5.onrender.com/seats`
      );

      setAllSeats(res.data.seats);
    } catch (error) {
      console.log(error);
    }
  };

// This function is handling number of tickets input.
  let handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

// This function is for booking seats and handling logic for valid user input.
// If user input is not valid it will not fetch data and will show error to user. 
let bookSeats= async()=>{
    setLoad(true)
try {

// This condition is checking if input is empty or not.
    if(value===""){
        toast({
            position: 'top',
            title: 'Aleart',
            
            description: "Enter valid Number",
            status: 'error',
            duration: 3000,
            isClosable: true,
          })

// This condition is checking if user input is less then or equal to 7 or not.
    }else if(+value>=7){
        toast({
            position: 'top',
            title: 'Aleart',
            description: "You can book only 7 ticket at one go",
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
    }else{

// if above both condition are false this will send request to server to book seats.
      let res =  await axios.patch(`https://assignmentbackend-2yf5.onrender.com/seats/book`,{number:value})
       setTicket(res.data.seatNo)
      getAllSeats()
        onOpen()
        setLoad(false)
        setValue("")
    }
} catch (error) {
    console.log(error)
}
}

// This useEffect function calling a function on first rendering to fetch intial data.
  useEffect(() => {
    getAllSeats();
  }, []);

  return (
    <>
    <Stack
      w="100vw"
      h={{base:"auto",md:"100vh",lg:"100vh"}}
      bgColor={{base:"#836ff0"}}
      bgImage={{base:"",md:bgImage,lg:bgImage}}
      bgSize={"cover"}
      direction={{base:"column",md:"row",lg:"row"}}
    >
      <Box w={{base:"100%",md:"50%",lg:"50%"}} p="30px">
        <Text fontWeight={"bold"} fontSize={{base:"2.5em",md:"3em",lg:"4em"}} color="white">
          The Sky Is Waiting For You
        </Text>
        <Heading color={"#5500b2"}>BOOK YOUR TICKETS NOW</Heading>
        <VStack w={{base:"100%",md:"70%",lg:"70%"}} m="auto" mt="10vh">
          <Text fontWeight={"bold"} fontSize={"1.5rem"} color="white">
            Enter Number of Tickets You Want
          </Text>
          <input
            type="number"
            placeholder="Enter Number"
            value={value}
            onChange={handleChange}
            style={{
              width: "40%",
              fontSize: "1.2em",
              padding: "5px",
              textAlign: "center",
              color: "#5500b2",
              fontWeight: "bold",
            }}
            min="1"
            max="7"
          ></input>
          <Button w="40%" isLoading={load} bgColor={"#5500b2"} color="white" fontWeight={"bold"}  onClick={bookSeats}>
            BOOK
          </Button>
        </VStack>
      </Box>
      <Box w={{base:"100%",md:"50%",lg:"50%"}}>
        <HStack w="50%" m="auto" mt="20px">
        <Box h="15px" w="15px" bgColor={"red.500"}></Box> <Text as={"span"} color="blue.500" fontWeight={"bold"}>Booked</Text>
        <Box h="15px" w="15px" bgColor={"yellow.400"}></Box> <Text as={"span"} color="blue.500" fontWeight={"bold"}>Availible</Text>
        </HStack>
       
        <Grid
          gridTemplateColumns={"repeat(7,1fr)"}
          gap="10px"
          w="60%"
          m="auto"
          mt="6%"
        >
          {allSeats.length > 0 &&
            allSeats.map((e) => <Seat key={e.seatNumber} {...e} />)}
        </Grid>
      </Box>
    </Stack>
    
{/* this is modal. it will show booking seats numbers */}

    <Modal  isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="green.400" fontSize={"1.5em"}>congratulations!</ModalHeader>
          <ModalCloseButton />
          <ModalBody color="green.400" fontSize={"1.5em"}>
            <Text>Your Ticket has been booked</Text> <br />
            <Text color="blue.400">Your Seat Numbers</Text>
            <Grid gridTemplateColumns={"repeat(4,1fr)"} gap="10px">
           {ticket.length>0 && ticket.map((num)=> <Tickets key={num} num={num}/>)}
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Homepage;
