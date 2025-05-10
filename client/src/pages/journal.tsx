import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Calendar, BookOpen, Smile, Meh, Frown, Search, Filter, Tag, ChevronRight } from "lucide-react";

// Mock journal data
const mockJournals = [
  {
    id: 1,
    title: "Productive day at work",
    content: "Today was incredibly productive. I managed to complete the project ahead of schedule and received positive feedback from my manager. I'm feeling motivated to tackle more challenges tomorrow.",
    date: "2023-10-15",
    sentiment: {
      rating: 4.5,
      analysis: "Very positive sentiment with themes of accomplishment and motivation."
    },
    tags: ["work", "productivity", "success"]
  },
  {
    id: 2,
    title: "Reflecting on goals",
    content: "Spent some time today reflecting on my quarterly goals. I'm making good progress on most of them, but I need to focus more on my health goals. Going to adjust my schedule to include more exercise time.",
    date: "2023-10-10",
    sentiment: {
      rating: 3.8,
      analysis: "Positive sentiment with elements of self-reflection and planning."
    },
    tags: ["goals", "reflection", "planning"]
  },
  {
    id: 3,
    title: "Challenging day",
    content: "Today was difficult. Had a disagreement with a colleague that left me feeling frustrated. Need to work on my communication skills and find better ways to express my ideas without coming across as confrontational.",
    date: "2023-10-05",
    sentiment: {
      rating: 2.3,
      analysis: "Somewhat negative sentiment with themes of frustration and self-criticism, but includes constructive reflection."
    },
    tags: ["challenge", "communication", "growth"]
  }
];

interface Journal {
  id: number;
  title: string;
  content: string;
  date: string;
  sentiment?: {
    rating: number;
    analysis: string;
  };
  tags?: string[];
}

export default function JournalPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [journals, setJournals] = useState<Journal[]>(mockJournals);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJournal, setNewJournal] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split('T')[0],
    tags: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleAddJournal = () => {
    if (!newJournal.content) {
      toast({
        title: "Error",
        description: "Journal content is required",
        variant: "destructive",
      });
      return;
    }

    // Simulate sentiment analysis
    const sentimentRating = Math.random() * 3 + 2; // Random between 2-5
    let sentimentAnalysis = "";
    
    if (sentimentRating >= 4) {
      sentimentAnalysis = "Positive sentiment with themes of optimism and growth.";
    } else if (sentimentRating >= 3) {
      sentimentAnalysis = "Neutral sentiment with balanced emotional content.";
    } else {
      sentimentAnalysis = "Somewhat challenging sentiment with opportunities for reflection.";
    }

    // Process tags
    const tags = newJournal.tags
      ? newJournal.tags.split(',').map(tag => tag.trim().toLowerCase())
      : [];

    const journal: Journal = {
      id: journals.length + 1,
      title: newJournal.title || `Journal Entry - ${new Date().toLocaleDateString()}`,
      content: newJournal.content,
      date: newJournal.date,
      sentiment: {
        rating: sentimentRating,
        analysis: sentimentAnalysis
      },
      tags
    };

    setJournals([journal, ...journals]);
    setNewJournal({
      title: "",
      content: "",
      date: new Date().toISOString().split('T')[0],
      tags: ""
    });
    setShowAddForm(false);

    toast({
      title: "Journal entry added",
      description: "Your journal entry has been saved successfully",
    });
  };

  const getSentimentIcon = (rating?: number) => {
    if (!rating) return <Meh className="h-5 w-5 text-gray-400" />;
    
    if (rating >= 4) {
      return <Smile className="h-5 w-5 text-green-500" />;
    } else if (rating >= 3) {
      return <Meh className="h-5 w-5 text-yellow-500" />;
    } else {
      return <Frown className="h-5 w-5 text-red-500" />;
    }
  };

  const getSentimentColor = (rating?: number) => {
    if (!rating) return "bg-gray-100 text-gray-800";
    
    if (rating >= 4) {
      return "bg-green-100 text-green-800";
    } else if (rating >= 3) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-red-100 text-red-800";
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter journals based on search term and active tag
  const filteredJournals = journals.filter(journal => {
    const matchesSearch = searchTerm === "" || 
      journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = activeTag === null || 
      (journal.tags && journal.tags.includes(activeTag));
    
    return matchesSearch && matchesTag;
  });

  // Get all unique tags
  const allTags = Array.from(
    new Set(
      journals.flatMap(journal => journal.tags || [])
    )
  );

  // Get sentiment distribution
  const sentimentCounts = {
    positive: journals.filter(j => j.sentiment && j.sentiment.rating >= 4).length,
    neutral: journals.filter(j => j.sentiment && j.sentiment.rating >= 3 && j.sentiment.rating < 4).length,
    negative: journals.filter(j => j.sentiment && j.sentiment.rating < 3).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Journal</h1>
              <p className="text-sm text-gray-500 mt-1">Record your thoughts and track your emotional patterns</p>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-gradient-to-r from-purple-500 to-indigo-600">
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
        </div>
      </header>
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 col-span-1 md:col-span-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sentiment Analysis</h3>
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
                    {sentimentCounts.positive > 0 && (
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${(sentimentCounts.positive / journals.length) * 100}%` }}
                      ></div>
                    )}
                    {sentimentCounts.neutral > 0 && (
                      <div 
                        className="h-full bg-yellow-500" 
                        style={{ width: `${(sentimentCounts.neutral / journals.length) * 100}%` }}
                      ></div>
                    )}
                    {sentimentCounts.negative > 0 && (
                      <div 
                        className="h-full bg-red-500" 
                        style={{ width: `${(sentimentCounts.negative / journals.length) * 100}%` }}
                      ></div>
                    )}
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                      <span>Positive ({sentimentCounts.positive})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full mr-1"></div>
                      <span>Neutral ({sentimentCounts.neutral})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-red-500 rounded-full mr-1"></div>
                      <span>Negative ({sentimentCounts.negative})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Entries</div>
                  <div className="text-2xl font-bold">{journals.length}</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">This Month</div>
                  <div className="text-2xl font-bold">{journals.filter(j => new Date(j.date).getMonth() === new Date().getMonth()).length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search journal entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500 flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Tags:
              </span>
              <Button 
                variant={activeTag === null ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveTag(null)}
              >
                All
              </Button>
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={activeTag === tag ? "default" : "outline"}
                  size="sm"
                  className={activeTag === tag ? "" : "bg-gray-100 text-gray-800"}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Add journal form */}
          {showAddForm && (
            <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
                New Journal Entry
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (Optional)
                  </label>
                  <Input
                    value={newJournal.title}
                    onChange={(e) => setNewJournal({ ...newJournal, title: e.target.value })}
                    placeholder="Enter a title for your journal entry"
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={newJournal.date}
                      onChange={(e) => setNewJournal({ ...newJournal, date: e.target.value })}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma separated)
                    </label>
                    <Input
                      value={newJournal.tags}
                      onChange={(e) => setNewJournal({ ...newJournal, tags: e.target.value })}
                      placeholder="e.g. work, reflection, goals"
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={newJournal.content}
                    onChange={(e) => setNewJournal({ ...newJournal, content: e.target.value })}
                    placeholder="Write your thoughts, reflections, and experiences..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm h-40 p-2"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddJournal} className="bg-gradient-to-r from-purple-500 to-indigo-600">
                    Save Entry
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Journal entries */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : filteredJournals.length > 0 ? (
              filteredJournals.map((journal) => (
                <div key={journal.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">{journal.title}</h2>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(journal.date)}
                      </div>
                    </div>
                    <div className="prose max-w-none mb-4">
                      <p className="text-gray-700">{journal.content}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {journal.tags?.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-medium flex items-center"
                          onClick={() => setActiveTag(tag)}
                          style={{ cursor: 'pointer' }}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    {journal.sentiment && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getSentimentIcon(journal.sentiment.rating)}
                            <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${getSentimentColor(journal.sentiment.rating)}`}>
                              {journal.sentiment.rating >= 4 ? "Positive" : 
                               journal.sentiment.rating >= 3 ? "Neutral" : "Needs Attention"}
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" className="flex items-center text-gray-500">
                            <span className="text-xs">View Details</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {journal.sentiment.analysis}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No journal entries</h3>
                <p className="mt-1 text-sm text-gray-500">Start writing your thoughts and reflections.</p>
                <div className="mt-6">
                  <Button onClick={() => setShowAddForm(true)} className="bg-gradient-to-r from-purple-500 to-indigo-600">
                    <Plus className="h-4 w-4 mr-2" />
                    New Journal Entry
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}