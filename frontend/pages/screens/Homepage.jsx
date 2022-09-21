import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import {
  Stack,
  Flex,
  Button,
  Text,
  VStack,
  useBreakpointValue,
  Heading,
  Image,
  SimpleGrid,
  Box,
  Container,
} from "@chakra-ui/react";
import Link from "next/link";

function Homepage(props) {
  const router = useRouter();
  const { authenticate, isAuthenticated } = useMoralis();

  useEffect(() => {
    if (isAuthenticated) router.push("/screens/App");
  }, [isAuthenticated]);
  return (
    <>
      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={6} w={"full"} maxW={"lg"}>
            <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
              <Text
                as={"span"}
                position={"relative"}
                _after={{
                  content: "''",
                  width: "full",
                  height: useBreakpointValue({ base: "20%", md: "30%" }),
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  bg: "blue.400",
                  zIndex: -1,
                }}
              >
                Ownly,
              </Text>
              <br />{" "}
              <Text color={"blue.400"} as={"span"}>
                an Own and Share  NFT Copyright Platform
              </Text>{" "}
            </Heading>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              You can choose to place a price on anything you own in the digital
              world and share, sell the copyright.
            </Text>
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <Link href={"/screens/App"}>
                <Button
                  rounded={"full"}
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Launch App
                </Button>
              </Link>
              <Button rounded={"full"} onClick={authenticate}>
                Connect Wallet
              </Button>
            </Stack>
          </Stack>
        </Flex>
        <Flex flex={1} direction="column" justify="space-between">
          <Container ml={10} />
          <Box
            width="250px"
            maxHeight="300px"
            boxShadow="dark-lg"
            p="6"
            rounded="md"
            bg="white"
          >
            <Text fontSize="2xl">Social-U</Text>
            <Text fontSize="sm">
              All social media related NFTs generated from platforms like
              Twitter, Instagram, Tiktok, e.t.c can be minted and monetised by
              interested followers and those who have need for them.
            </Text>
          </Box>
          <Container />
          <Container justify="end" ml={10} mb={10}>
            <Box
              width="250px"
              maxHeight="300px"
              boxShadow="dark-lg"
              p="6"
              rounded="md"
              bg="white"
            >
              <Text fontSize="2xl">Non Social-U</Text>
              <Text fontSize="sm">
                Intellectual productions such as books, personal interviews,
                whistleblowers accounts, lectures, topsecrets, can also be
                minted and be traded on the blockchain for value. They can shared, sold
                or rented.
              </Text>
            </Box>
          </Container>
        </Flex>
      </Stack>
    </>
  );
}

export default Homepage;
