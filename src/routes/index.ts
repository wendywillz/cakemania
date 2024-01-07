import express, { Request, Response, NextFunction} from 'express';

import { getUserNavbar } from '../controller/indexcontroller';
import { authorize, noCache } from '../middleware/authorize';

var router = express.Router();

/* GET home page. */
router.get('/', getUserNavbar);

// router.get('/logout', authorize, noCache, logout);



export default router;
