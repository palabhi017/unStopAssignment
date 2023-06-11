import React from 'react'
import {Box} from "@chakra-ui/react"
import { Seats } from './Homepage'


const Seat = ({seatNumber,isBooked}:Seats) => {
  return (
    <Box bgColor={isBooked? "red.500":"yellow.500"} boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px" h="30px" borderRadius={"5px 5px 0px 0px"} fontWeight={"bold"} textAlign={"center"} color="white">S{seatNumber}</Box>
  )
}

export default Seat