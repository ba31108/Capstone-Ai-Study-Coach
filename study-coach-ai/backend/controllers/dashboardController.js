const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const StudyPlan = require('../models/StudyPlan');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

// GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalSubjects,
      totalTopics,
      completedTopics,
      inProgressTopics,
      notStartedTopics,
      totalStudyPlans,
      totalQuizzes,
      totalQuizResults,
      quizResults,
      latestQuizResults,
    ] = await Promise.all([
      Subject.countDocuments({ userId }),
      Topic.countDocuments({ userId }),
      Topic.countDocuments({ userId, status: 'completed' }),
      Topic.countDocuments({ userId, status: 'in_progress' }),
      Topic.countDocuments({ userId, status: 'not_started' }),
      StudyPlan.countDocuments({ userId }),
      Quiz.countDocuments({ userId }),
      QuizResult.countDocuments({ userId }),
      QuizResult.find({ userId }).select('percentage weakAreas'),
      QuizResult.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('quizId', 'title')
        .populate('topicId', 'title')
        .populate('subjectId', 'name'),
    ]);

    const averageQuizScore =
      quizResults.length > 0
        ? Math.round(
            quizResults.reduce((sum, r) => sum + r.percentage, 0) / quizResults.length
          )
        : 0;

    const overallProgress =
      totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    // Collect all weak areas
    const weakAreasSet = [];
    quizResults.forEach((r) => {
      r.weakAreas.forEach((area) => {
        if (!weakAreasSet.includes(area)) {
          weakAreasSet.push(area);
        }
      });
    });

    res.json({
      totalSubjects,
      totalTopics,
      completedTopics,
      inProgressTopics,
      notStartedTopics,
      totalStudyPlans,
      totalQuizzes,
      totalQuizResults,
      averageQuizScore,
      overallProgress,
      weakAreas: weakAreasSet,
      latestQuizResults,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
