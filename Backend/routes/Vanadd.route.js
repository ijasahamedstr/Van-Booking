import express from 'express';
import { VanCreate, VanDelete, VanIndex, VanSingleDetails, VanUpdate } from '../controller/Vanadd.Controller.js';

// Create a new router instance
const Vanaddsection = express.Router();


// Create the Data Register
Vanaddsection.post('/',VanCreate);

// View the Data Register
Vanaddsection.get('/',VanIndex);

// View the Single Data Register
Vanaddsection.get("/:id",VanSingleDetails);

//Delete Data Register
Vanaddsection.delete('/:id',VanDelete);

//Update Data Register
Vanaddsection.put('/:id',VanUpdate);


export default Vanaddsection;
