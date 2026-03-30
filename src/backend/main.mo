import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
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

  type ContactInfo = {
    address : Text;
    phone : Text;
    email : Text;
    operationalHours : Text;
  };

  // Storage
  let articles = Map.empty<Nat, Article>();
  var nextArticleId = 0;

  let teamMembers = Map.empty<Nat, TeamMember>();
  var nextTeamMemberId = 3;

  let activities = Map.empty<Nat, Activity>();
  var nextActivityId = 3;

  var contactInfo : ContactInfo = {
    address = "Jl. Brigjen Katamso No. 1, Subang, Jawa Barat 41211";
    phone = "(0260) 411-1234";
    email = "info@ssk-subang.go.id";
    operationalHours = "Senin – Jumat, 08.00 – 16.00 WIB";
  };

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
    articles.values().toArray();
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

  // TeamMember CRUD
  public shared ({ caller }) func createTeamMember(name : Text, role : Text, bio : Text, imageUrl : Text) : async TeamMember {
    let id = nextTeamMemberId;
    nextTeamMemberId += 1;

    let member : TeamMember = {
      id;
      name;
      role;
      bio;
      imageUrl;
    };

    teamMembers.add(id, member);
    member;
  };

  public query ({ caller }) func getTeamMember(id : Nat) : async TeamMember {
    switch (teamMembers.get(id)) {
      case (null) { Runtime.trap("Team member not found") };
      case (?member) { member };
    };
  };

  public query ({ caller }) func getAllTeamMembers() : async [TeamMember] {
    teamMembers.values().toArray();
  };

  public shared ({ caller }) func updateTeamMember(id : Nat, name : Text, role : Text, bio : Text, imageUrl : Text) : async TeamMember {
    switch (teamMembers.get(id)) {
      case (null) { Runtime.trap("Team member not found") };
      case (?existing) {
        let updated : TeamMember = {
          id;
          name;
          role;
          bio;
          imageUrl;
        };
        teamMembers.add(id, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func deleteTeamMember(id : Nat) : async () {
    if (not teamMembers.containsKey(id)) {
      Runtime.trap("Team member not found");
    };
    teamMembers.remove(id);
  };

  // Activity CRUD
  public shared ({ caller }) func createActivity(title : Text, description : Text, date : Time.Time, location : Text) : async Activity {
    let id = nextActivityId;
    nextActivityId += 1;

    let activity : Activity = {
      id;
      title;
      description;
      date;
      location;
    };

    activities.add(id, activity);
    activity;
  };

  public query ({ caller }) func getActivity(id : Nat) : async Activity {
    switch (activities.get(id)) {
      case (null) { Runtime.trap("Activity not found") };
      case (?activity) { activity };
    };
  };

  public query ({ caller }) func getAllActivities() : async [Activity] {
    activities.values().toArray();
  };

  public shared ({ caller }) func updateActivity(id : Nat, title : Text, description : Text, date : Time.Time, location : Text) : async Activity {
    switch (activities.get(id)) {
      case (null) { Runtime.trap("Activity not found") };
      case (?existing) {
        let updated : Activity = {
          id;
          title;
          description;
          date;
          location;
        };
        activities.add(id, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func deleteActivity(id : Nat) : async () {
    if (not activities.containsKey(id)) {
      Runtime.trap("Activity not found");
    };
    activities.remove(id);
  };

  // ContactInfo management
  public query ({ caller }) func getContactInfo() : async ContactInfo {
    contactInfo;
  };

  public shared ({ caller }) func updateContactInfo(address : Text, phone : Text, email : Text, operationalHours : Text) : async ContactInfo {
    contactInfo := {
      address;
      phone;
      email;
      operationalHours;
    };
    contactInfo;
  };
};
