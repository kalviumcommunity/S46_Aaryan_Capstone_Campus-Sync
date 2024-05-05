import Score from "../models/scoreSchema.js";

// Get score details
export const getScoreData = async (req, res) => {
    try {
        const subject = req.params.subject;
        const scores = await Score.find({ subject });

        if (scores.length === 0) {
            return res.status(404).json({ message: "Scores not found for the subject" });
        }

        // If scores are found, return the score data (subject and score)
        return res.status(200).json(scores.map(score => ({ subject: score.subject, score: score.score })));

    } catch (error) {
        console.error("Error fetching scores:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



// Create a new score entry
export const createScore = async (req, res) => {
    try {
        // Extract score data from request body
        const { subject, score } = req.body;

        // Check if score entry with the same subject already exists
        const existingScore = await Score.findOne({ subject });

        if (existingScore) {
            return res.status(400).json({ message: "Score entry for the subject already exists" });
        }

        // Create a new score and save to the database
        const newScore = new Score({ subject, score });        
        await newScore.save();

        // Return success message 
        return res.status(201).json({ message: "Score entry created successfully" });

    } catch (error) {
        console.error("Error creating score entry:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};