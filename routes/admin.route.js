const User = require('../models/user.model');
const router = require('express').Router();
const mongoose = require('mongoose');
const { roles } = require('../utils/constants');
const bcrypt = require('bcrypt');

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    // res.send(users);
    res.render('manage-users', { users });
  } catch (error) {
    next(error);
  }
});

router.get('/user/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid id');
      res.redirect('/admin/users');
      return;
    }
    const person = await User.findById(id);
    res.render('profile', { person });
  } catch (error) {
    next(error);
  }
});

// Route to add a new user
router.post('/add-user', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Validate inputs
    if (!email || !password || !role) {
      req.flash('error', 'Email, password, and role are required.');
      return res.redirect('back');
    }

    // Check for valid role
    const validRoles = Object.values(roles);
    if (!validRoles.includes(role)) {
      req.flash('error', 'Invalid role.');
      return res.redirect('back');
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'A user with this email already exists.');
      return res.redirect('back');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt to hash the password

    // Create the new user
    const newUser = new User({
      email,
      password: hashedPassword, // Store the hashed password
      role,
    });

    // Save the user to the database
    await newUser.save();

    req.flash('success', 'User added successfully!');
    res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
});

// Route to edit a user
router.post('/edit-user', async (req, res, next) => {
  try {
    const { id, email, role } = req.body;

    // Validate inputs
    if (!id || !email || !role) {
      req.flash('error', 'All fields are required.');
      return res.redirect('back');
    }

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid user ID.');
      return res.redirect('back');
    }

    // Validate role
    const validRoles = Object.values(roles);
    if (!validRoles.includes(role)) {
      req.flash('error', 'Invalid role.');
      return res.redirect('back');
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { email, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      req.flash('error', 'User not found.');
      return res.redirect('back');
    }

    req.flash('success', 'User details updated successfully.');
    res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
});

router.post('/update-role', async (req, res, next) => {
  try {
    const { id, role } = req.body;

    // Checking for id and roles in req.body
    if (!id || !role) {
      req.flash('error', 'Invalid request');
      return res.redirect('back');
    }

    // Check for valid mongoose objectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid id');
      return res.redirect('back');
    }

    // Check for Valid role
    const rolesArray = Object.values(roles);
    if (!rolesArray.includes(role)) {
      req.flash('error', 'Invalid role');
      return res.redirect('back');
    }

    // Admin cannot remove himself/herself as an admin
    if (req.user.id === id) {
      req.flash(
        'error',
        'Admins cannot remove themselves from Admin, ask another admin.'
      );
      return res.redirect('back');
    }

    // Finally update the user
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    req.flash('info', `updated role for ${user.email} to ${user.role}`);
    res.redirect('back');
  } catch (error) {
    next(error);
  }
});

// Delete user (NEW ROUTE)
router.post('/delete-user', async (req, res, next) => {
  try {
    const { id } = req.body;

    // Validate the ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid user ID');
      return res.redirect('back');
    }

    // Prevent admins from deleting themselves
    if (req.user.id === id) {
      req.flash('error', 'Admins cannot delete their own account.');
      return res.redirect('back');
    }

    // Find and delete the user
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('back');
    }

    req.flash('info', `Successfully deleted user: ${user.email}`);
    res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
