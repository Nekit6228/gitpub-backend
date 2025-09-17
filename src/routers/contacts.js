import { createContactControler, deleteContactControler, getAllContactsControler,getContatctByIdControler, patchContactController, upsertContactControler } from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { Router } from 'express';
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/multer.js";


const router = Router();


router.use(authenticate);

router.get('/', ctrlWrapper());

router.get('/:contactId',isValidId, ctrlWrapper());

router.post('/',upload.single('photo'),validateBody(), ctrlWrapper());

router.delete('/:contactId',isValidId, ctrlWrapper());

router.put('/:contactId',upload.single('photo'),isValidId,validateBody(), ctrlWrapper());

router.patch('/:contactId',upload.single('photo'),isValidId, validateBody(), ctrlWrapper());




export default router;



