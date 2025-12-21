import moment from "moment";
import VanaddModels from "../models/Vanadd.models.js";

/* ================= CREATE VAN ================= */
export const VanCreate = async (req, res) => {
    const { vanname, Seat, Type, type2, Image } = req.body;

    if (!vanname || !Seat || !Type || !type2 || !Image || Image.length === 0) {
        return res.status(400).json({
            status: 400,
            message: "All fields are required"
        });
    }

    try {
        const date = moment().format("YYYY-MM-DD");

        const newVan = new VanaddModels({
            vanname,
            Seat,
            Type,
            type2,
            Image,
            date
        });

        const savedVan = await newVan.save();

        res.status(201).json({
            status: 201,
            message: "Van created successfully",
            data: savedVan
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message
        });
    }
};

/* ================= GET ALL VANS ================= */
export const VanIndex = async (req, res) => {
    try {
        const vans = await VanaddModels.find().sort({ createdAt: -1 });
        res.status(200).json(vans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= GET SINGLE VAN ================= */
export const VanSingleDetails = async (req, res) => {
    try {
        const van = await VanaddModels.findById(req.params.id);
        if (!van) {
            return res.status(404).json({ message: "Van not found" });
        }
        res.status(200).json(van);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= UPDATE VAN ================= */
export const VanUpdate = async (req, res) => {
    const { id } = req.params;
    const { vanname, Seat, Type, type2, Image } = req.body;

    try {
        const van = await VanaddModels.findById(id);
        if (!van) {
            return res.status(404).json({ message: "Van not found" });
        }

        if (vanname) van.vanname = vanname;
        if (Seat) van.Seat = Seat;
        if (Type) van.Type = Type;
        if (type2) van.type2 = type2;
        if (Image) van.Image = Image;

        const updatedVan = await van.save();

        res.status(200).json({
            status: 200,
            message: "Van updated successfully",
            data: updatedVan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= DELETE VAN ================= */
export const VanDelete = async (req, res) => {
    try {
        await VanaddModels.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Van deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
