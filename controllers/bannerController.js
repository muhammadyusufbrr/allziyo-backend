const Banner = require('../models/Banner');
const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
  if (!filePath) return;

  const relativePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const fullPath = path.join(__dirname, '..', relativePath);
  
  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) console.error("Fayl o'chirishda xato:", err);
    });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner topilmadi" });
    }
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Rasm yuklanishi shart!" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const banner = await Banner.create({
      title: req.body.title,
      link: req.body.link || '/',
      order: req.body.order || 0,
      image: imagePath,
      isActive: true
    });

    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    if (req.file) deleteFile(`/uploads/${req.file.filename}`);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    let banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: "Topilmadi" });

    let imagePath = banner.image;

    if (req.file) {
      deleteFile(banner.image); 
      imagePath = `/uploads/${req.file.filename}`; 
    }

    banner = await Banner.findByIdAndUpdate(req.params.id, {
      title: req.body.title || banner.title,
      link: req.body.link || banner.link,
      order: req.body.order || banner.order,
      image: imagePath
    }, { new: true });

    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    if (req.file) deleteFile(`/uploads/${req.file.filename}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: "Topilmadi" });

    deleteFile(banner.image);
    await banner.deleteOne();

    res.status(200).json({ success: true, message: "Banner o'chirildi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.reorderBanners = async (req, res) => {
  try {
    const { banners } = req.body; // Frontdan [{_id: '...', order: 1}, ...] keladi

    if (!banners || !Array.isArray(banners)) {
      return res.status(400).json({ success: false, message: "Noto'g'ri ma'lumot" });
    }

    // BulkWrite orqali hammasini bittada yangilaymiz
    const bulkOps = banners.map((banner, index) => ({
      updateOne: {
        filter: { _id: banner._id },
        update: { order: index + 1 } // Index 0 dan boshlanadi, biz 1 dan yozamiz
      }
    }));

    await Banner.bulkWrite(bulkOps);

    res.status(200).json({ success: true, message: "Bannerlar tartibi saqlandi" });
  } catch (error) {
    console.error("Reorder error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};