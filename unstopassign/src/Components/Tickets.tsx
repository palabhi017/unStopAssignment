import { Box } from '@chakra-ui/react'
import React from 'react'

const Tickets = ({num}:{num:string}) => {
  return (
   <Box h="10vh" bgColor={"green.200"} textAlign={"center"} p="5px" fontWeight={"bold"}>
     S{num}
   </Box>
  )
}

export default Tickets