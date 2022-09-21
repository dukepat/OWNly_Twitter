import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";

function FundVaultModal({ contract }) {
  const [ethValue, setEthValue] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fundVault = async () => {
    try {
      const response = await contract.fundVaultWithEth({
        value: ethers.utils.parseUnits(ethValue.toString(), "ether"),
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button onClick={onOpen}>Fund Vault</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fund your OWNly Vault</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Enter Amount</FormLabel>
              <Input
                placeholder="Enter Ether amount"
                onChange={(e) => setEthValue(e.target.value)}
                type="number"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={fundVault}>
              FUND
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default FundVaultModal;
