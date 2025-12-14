const CareGuide = require("../models/careGuide");

exports.getAllGuides = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = { name: { $regex: search, $options: "i" } };
    }

    const guides = await CareGuide.find(query).select(
      "name scientificName image"
    );

    res
      .status(201)
      .json({ success: true, message: "Fetched guides successful", guides });
  } catch (err) {
    console.error("Error in fetching guides", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error in careGuide Controller",
      });
  }
};

exports.getGuideDetail = async (req, res) => {
  try {
    const guide = await CareGuide.findById(req.params.id);

    if (!guide) {
      return res
        .status(404)
        .json({ success: false, message: "Guide not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Care guide details found", guide });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error in careguide details" }, error);
  }
};
