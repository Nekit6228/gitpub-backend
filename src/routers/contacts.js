import { validateBody } from "../middlewares/validateBody.js";
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { Router } from 'express';
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";


const router = Router();


router.use(authenticate);

router.get('/', ctrlWrapper());

router.get('/:contactId',isValidId, ctrlWrapper());

router.post('/',validateBody(), ctrlWrapper());

router.delete('/:contactId',isValidId, ctrlWrapper());

router.put('/:contactId',isValidId,validateBody(), ctrlWrapper());

router.patch('/:contactId',isValidId, validateBody(), ctrlWrapper());




export default router;



