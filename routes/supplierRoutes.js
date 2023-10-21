
import { Router } from "express";
import SupRequest from "../models/supplierRequests.js";
import AcceptedRequest from "../models/acceptedRequests.js";

const router = Router();

router.get('/fetch-pending-requests', async (req, res) => {
  try {
    const requests = await SupRequest.find();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/accepted', async (req, res) => {
  try {
    const requests = await AcceptedRequest.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/confirm/:id', async (req, res) => {
  const requestId = req.params.id;

  try {
    const requestToDelete = await SupRequest.findById(requestId);

    if (!requestToDelete) {
      return res.status(404).json({ message: 'Supplier request not found' });
    }

    const { itemName, quantity, description, itemType, requestDate, requestedBy } = requestToDelete;

    const date = new Date();

    const newAcceptedRequest = new AcceptedRequest({
      itemName,
      quantity,
      description,
      itemType,
      requestDate,
      requestedBy,
      acceptedBy: 'Ravishka',
      date
    });

    try {
      const savedRequest = await newAcceptedRequest.save();

      // Handle successful addition to the AcceptedRequest collection

      const deletedRequest = await SupRequest.findByIdAndDelete(requestId);

      if (!deletedRequest) {
        return res.status(404).json({ message: 'Supplier request not found' });
      }

      res.json({ message: 'Supplier request deleted successfully' });

    } catch (err) {
      res.status(400).json({ error: err.message });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/cancel/:id', async (req, res) => {
  const requestId = req.params.id;

  try {
    const requestToDelete = await AcceptedRequest.findById(requestId);

    if (!requestToDelete) {
      return res.status(404).json({ message: 'Accepted request not found' });
    }

    const { itemName, quantity, description, itemType, requestDate, requestedBy } = requestToDelete;

    const newRequest = new SupRequest({
      itemName,
      quantity,
      description,
      itemType,
      requestDate,
      requestedBy
    });

    try {
      const savedRequest = await newRequest.save();

      const deletedRequest = await AcceptedRequest.findByIdAndDelete(requestId);

      if (!deletedRequest) {
        return res.status(404).json({ message: 'Accepted request not found' });
      }

      res.json({ message: 'Accepted request deleted successfully' });

    } catch (err) {
      res.status(400).json({ error: err.message });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;