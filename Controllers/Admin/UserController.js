const User = require('../../Models/User/AuthModel');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field for security
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// users count
exports.getTotalUsersCount = async (req, res) => {
    try {
      const count = await User.countDocuments();
      res.status(200).json({ totalUsers: count });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };