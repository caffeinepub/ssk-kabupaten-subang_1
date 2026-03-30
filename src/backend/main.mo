import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Order "mo:core/Order";

actor {
  // Types
  type Article = {
    id : Nat;
    title : Text;
    excerpt : Text;
    content : Text;
    category : Text;
    date : Time.Time;
    imageUrl : Text;
  };

  type TeamMember = {
    id : Nat;
    name : Text;
    role : Text;
    bio : Text;
    imageUrl : Text;
  };

  type Activity = {
    id : Nat;
    title : Text;
    description : Text;
    date : Time.Time;
    location : Text;
  };

  // Comparison functions
  module Article {
    public func compare(a1 : Article, a2 : Article) : Order.Order {
      Nat.compare(a1.id, a2.id);
    };
  };

  module TeamMember {
    public func compare(tm1 : TeamMember, tm2 : TeamMember) : Order.Order {
      Nat.compare(tm1.id, tm2.id);
    };
  };

  module Activity {
    public func compare(a1 : Activity, a2 : Activity) : Order.Order {
      Nat.compare(a1.id, a2.id);
    };
  };

  // Storage
  let articles = Map.empty<Nat, Article>();
  var nextArticleId = 0;

  // Seeded team members
  let teamMembers = List.fromArray<TeamMember>([
    {
      id = 1;
      name = "John Doe";
      role = "Coordinator";
      bio = "Experienced population management expert.";
      imageUrl = "/images/john.jpg";
    },
    {
      id = 2;
      name = "Jane Smith";
      role = "Assistant";
      bio = "Focuses on community outreach.";
      imageUrl = "/images/jane.jpg";
    },
  ]);

  // Seeded activities
  let activities = List.fromArray<Activity>([
    {
      id = 1;
      title = "Population Census";
      description = "Annual population census in Subang.";
      date = 1_619_623_000;
      location = "Subang";
    },
    {
      id = 2;
      title = "Health Awareness Campaign";
      description = "Promoting healthy living in the community.";
      date = 1_625_423_000;
      location = "Subang";
    },
  ]);

  // Article CRUD
  public shared ({ caller }) func createArticle(title : Text, excerpt : Text, content : Text, category : Text, imageUrl : Text) : async Article {
    let id = nextArticleId;
    nextArticleId += 1;

    let article : Article = {
      id;
      title;
      excerpt;
      content;
      category;
      date = Time.now();
      imageUrl;
    };

    articles.add(id, article);
    article;
  };

  public query ({ caller }) func getArticle(id : Nat) : async Article {
    switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?article) { article };
    };
  };

  public query ({ caller }) func getAllArticles() : async [Article] {
    articles.values().toArray().sort();
  };

  public shared ({ caller }) func updateArticle(id : Nat, title : Text, excerpt : Text, content : Text, category : Text, imageUrl : Text) : async Article {
    switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?existing) {
        let updated : Article = {
          id;
          title;
          excerpt;
          content;
          category;
          date = Time.now();
          imageUrl;
        };
        articles.add(id, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func deleteArticle(id : Nat) : async () {
    if (not articles.containsKey(id)) {
      Runtime.trap("Article not found");
    };
    articles.remove(id);
  };

  // Team members (read-only)
  public query ({ caller }) func getTeamMembers() : async [TeamMember] {
    teamMembers.toArray().sort();
  };

  public query ({ caller }) func getTeamMember(id : Nat) : async TeamMember {
    let member = teamMembers.toArray().find(func(t) { t.id == id });
    switch (member) {
      case (null) { Runtime.trap("Team member not found") };
      case (?m) { m };
    };
  };

  // Activities (read-only)
  public query ({ caller }) func getActivities() : async [Activity] {
    activities.toArray().sort();
  };

  public query ({ caller }) func getActivity(id : Nat) : async Activity {
    let activity = activities.toArray().find(func(a) { a.id == id });
    switch (activity) {
      case (null) { Runtime.trap("Activity not found") };
      case (?a) { a };
    };
  };
};
