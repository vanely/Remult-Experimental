import express, { Router } from 'express';
import type { UserInfo } from 'remult';

const validUsers: UserInfo[] = [
  { id: '1', name: 'Ylias' },
  { id: '2', name: 'Leila' },
];

export const auth = Router();
auth.use(express.json());

auth.post('/api/signIn', (req, res) => {
  const user = validUsers.find((user) => user.name === req.body.userName);
	if (user) {
		req.session!['user'] = user;
		res.json(user);
	} else {
		res.status(403).json('Invalid user, access denied');
	}
});

auth.post('/api/signOut', (req, res) => {
	req.session!['user'] = null;
	res.json('Signed out');
});

auth.get('/api/currentUser', (req, res) => {
	res.json(req.session!['user']);
});
