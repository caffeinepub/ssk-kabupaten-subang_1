import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";



actor {
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

  type ProgramUnggulan = {
    judul : Text;
    deskripsi : Text;
    pesertaTerlatih : Text;
    programKegiatan : Text;
    penghargaan : Text;
    kecamatanTerlayani : Text;
  };

  type VideoYoutube = {
    id : Nat;
    title : Text;
    youtubeId : Text;
    description : Text;
  };

  type Profile = {
    namaOrganisasi : Text;
    tagline : Text;
    deskripsi : Text;
    visi : Text;
    misi : Text;
  };

  type GaleriItem = {
    id : Nat;
    title : Text;
    description : Text;
    mediaUrl : Text;
    mediaType : Text;
    tanggal : Time.Time;
  };

  type PendaftaranAnggota = {
    id : Nat;
    nama : Text;
    nik : Text;
    alamat : Text;
    phone : Text;
    email : Text;
    pekerjaan : Text;
    alasan : Text;
    tanggalDaftar : Time.Time;
    status : Text;
  };

  type SatuanSSK = {
    id : Nat;
    nama : Text;
    alamat : Text;
    phone : Text;
    email : Text;
    deskripsi : Text;
    logoUrl : Text;
    ketua : Text;
  };

  type SiteSettings = {
    logoUrl : Text;
  };

  type SliderBanner = {
    id : Nat;
    title : Text;
    description : Text;
    imageUrl : Text;
    linkUrl : Text;
    urutan : Nat;
  };


  // Stable storage - persists across upgrades
  stable var stableArticles : [(Nat, Article)] = [];
  stable var stableTeamMembers : [(Nat, TeamMember)] = [];
  stable var stableActivities : [(Nat, Activity)] = [];
  stable var stableVideos : [(Nat, VideoYoutube)] = [];
  stable var stableNextArticleId : Nat = 0;
  stable var stableNextTeamMemberId : Nat = 3;
  stable var stableNextActivityId : Nat = 3;
  stable var stableNextVideoId : Nat = 0;
  stable var stableContactInfo : ContactInfo = {
    address = "Jl. Brigjen Katamso No. 1, Subang, Jawa Barat 41211";
    phone = "(0260) 411-1234";
    email = "info@ssk-subang.go.id";
    operationalHours = "Senin - Jumat, 08.00 - 16.00 WIB";
  };
  stable var stableProgramUnggulan : ProgramUnggulan = {
    judul = "Program Unggulan SSK Kabupaten Subang";
    deskripsi = "Edukasi Kependudukan yang Inovatif dan Berkelanjutan memberikan dampak nyata bagi masyarakat Kabupaten Subang melalui program terstruktur dan terukur.";
    pesertaTerlatih = "1.000+";
    programKegiatan = "15+";
    penghargaan = "5+";
    kecamatanTerlayani = "30+";
  };
  stable var stableProfile : Profile = {
    namaOrganisasi = "SSK Kabupaten Subang";
    tagline = "Edukasi Kependudukan yang Inovatif dan Berkelanjutan";
    deskripsi = "Satuan Tugas Stunting Kabupaten Subang berkomitmen untuk meningkatkan kualitas sumber daya manusia melalui program edukasi kependudukan yang berkelanjutan.";
    visi = "Terwujudnya Kabupaten Subang yang sejahtera melalui pengendalian penduduk dan pembangunan keluarga berkualitas.";
    misi = "Meningkatkan pemahaman masyarakat tentang kependudukan; Memperkuat program keluarga berencana; Meningkatkan kualitas data kependudukan.";
  };

  stable var stableGaleriItems : [(Nat, GaleriItem)] = [];
  stable var stablePendaftaranAnggota : [(Nat, PendaftaranAnggota)] = [];
  stable var stableSatuanSSK : [(Nat, SatuanSSK)] = [];
  stable var stableNextGaleriItemId : Nat = 0;
  stable var stableNextPendaftaranId : Nat = 0;
  stable var stableNextSatuanId : Nat = 0;
  stable var stableSiteSettings : SiteSettings = {
    logoUrl = "";
  };
  stable var stableSliderBanners : [(Nat, SliderBanner)] = [];
  stable var stableNextSliderId : Nat = 0;
  stable var stableAdminPrincipal : ?Principal = null;

  // In-memory working copies - initialized from stable storage
  let articles = Map.empty<Nat, Article>();
  let teamMembers = Map.empty<Nat, TeamMember>();
  let activities = Map.empty<Nat, Activity>();
  let videos = Map.empty<Nat, VideoYoutube>();
  let galeriItems = Map.empty<Nat, GaleriItem>();
  let pendaftaranAnggota = Map.empty<Nat, PendaftaranAnggota>();
  let satuanSSK = Map.empty<Nat, SatuanSSK>();
  let sliderBanners = Map.empty<Nat, SliderBanner>();

  var nextArticleId = stableNextArticleId;
  var nextTeamMemberId = stableNextTeamMemberId;
  var nextActivityId = stableNextActivityId;
  var nextVideoId = stableNextVideoId;
  var nextGaleriItemId = stableNextGaleriItemId;
  var nextPendaftaranId = stableNextPendaftaranId;
  var nextSatuanId = stableNextSatuanId;
  var nextSliderId = stableNextSliderId;

  var contactInfo : ContactInfo = stableContactInfo;
  var programUnggulan : ProgramUnggulan = stableProgramUnggulan;
  var profile : Profile = stableProfile;
  var siteSettings : SiteSettings = stableSiteSettings;
  var adminPrincipal : ?Principal = stableAdminPrincipal;

  // Load data from stable storage into working maps (runs on install AND upgrade)
  for ((k, v) in stableArticles.vals()) { articles.add(k, v) };
  for ((k, v) in stableTeamMembers.vals()) { teamMembers.add(k, v) };
  for ((k, v) in stableActivities.vals()) { activities.add(k, v) };
  for ((k, v) in stableVideos.vals()) { videos.add(k, v) };
  for ((k, v) in stableGaleriItems.vals()) { galeriItems.add(k, v) };
  for ((k, v) in stablePendaftaranAnggota.vals()) { pendaftaranAnggota.add(k, v) };
  for ((k, v) in stableSatuanSSK.vals()) { satuanSSK.add(k, v) };
  for ((k, v) in stableSliderBanners.vals()) { sliderBanners.add(k, v) };

  // Persist to stable storage before upgrade
  system func preupgrade() {
    stableArticles := articles.entries().toArray();
    stableTeamMembers := teamMembers.entries().toArray();
    stableActivities := activities.entries().toArray();
    stableVideos := videos.entries().toArray();
    stableGaleriItems := galeriItems.entries().toArray();
    stablePendaftaranAnggota := pendaftaranAnggota.entries().toArray();
    stableSatuanSSK := satuanSSK.entries().toArray();
    stableSliderBanners := sliderBanners.entries().toArray();
    stableNextArticleId := nextArticleId;
    stableNextTeamMemberId := nextTeamMemberId;
    stableNextActivityId := nextActivityId;
    stableNextVideoId := nextVideoId;
    stableNextGaleriItemId := nextGaleriItemId;
    stableNextPendaftaranId := nextPendaftaranId;
    stableNextSatuanId := nextSatuanId;
    stableNextSliderId := nextSliderId;
    stableContactInfo := contactInfo;
    stableProgramUnggulan := programUnggulan;
    stableProfile := profile;
    stableSiteSettings := siteSettings;
    stableAdminPrincipal := adminPrincipal;
  };

  // Article CRUD
  public shared ({ caller }) func createArticle(title : Text, excerpt : Text, content : Text, category : Text, imageUrl : Text) : async Article {
    let id = nextArticleId;
    nextArticleId += 1;
    let article : Article = { id; title; excerpt; content; category; date = Time.now(); imageUrl };
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
        let updated : Article = { id; title; excerpt; content; category; date = Time.now(); imageUrl };
        articles.add(id, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func deleteArticle(id : Nat) : async () {
    if (not articles.containsKey(id)) { Runtime.trap("Article not found") };
    articles.remove(id);
  };

  // Team Member CRUD
  public shared ({ caller }) func createTeamMember(name : Text, role : Text, bio : Text, imageUrl : Text) : async TeamMember {
    let id = nextTeamMemberId;
    nextTeamMemberId += 1;
    let member : TeamMember = { id; name; role; bio; imageUrl };
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
        let updated : TeamMember = { id; name; role; bio; imageUrl };
        teamMembers.add(id, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func deleteTeamMember(id : Nat) : async () {
    if (not teamMembers.containsKey(id)) { Runtime.trap("Team member not found") };
    teamMembers.remove(id);
  };

  // Activity CRUD
  public shared ({ caller }) func createActivity(title : Text, description : Text, date : Time.Time, location : Text) : async Activity {
    let id = nextActivityId;
    nextActivityId += 1;
    let activity : Activity = { id; title; description; date; location };
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
        let updated : Activity = { id; title; description; date; location };
        activities.add(id, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func deleteActivity(id : Nat) : async () {
    if (not activities.containsKey(id)) { Runtime.trap("Activity not found") };
    activities.remove(id);
  };

  // Contact Info
  public query ({ caller }) func getContactInfo() : async ContactInfo {
    contactInfo;
  };

  public shared ({ caller }) func updateContactInfo(address : Text, phone : Text, email : Text, operationalHours : Text) : async ContactInfo {
    contactInfo := { address; phone; email; operationalHours };
    contactInfo;
  };

  // Program Unggulan
  public query ({ caller }) func getProgramUnggulan() : async ProgramUnggulan {
    programUnggulan;
  };

  public shared ({ caller }) func updateProgramUnggulan(judul : Text, deskripsi : Text, pesertaTerlatih : Text, programKegiatan : Text, penghargaan : Text, kecamatanTerlayani : Text) : async ProgramUnggulan {
    programUnggulan := { judul; deskripsi; pesertaTerlatih; programKegiatan; penghargaan; kecamatanTerlayani };
    programUnggulan;
  };

  // Video YouTube CRUD
  public shared ({ caller }) func createVideo(title : Text, youtubeId : Text, description : Text) : async VideoYoutube {
    let id = nextVideoId;
    nextVideoId += 1;
    let video : VideoYoutube = { id; title; youtubeId; description };
    videos.add(id, video);
    video;
  };

  public query ({ caller }) func getAllVideos() : async [VideoYoutube] {
    videos.values().toArray();
  };

  public shared ({ caller }) func updateVideo(id : Nat, title : Text, youtubeId : Text, description : Text) : async VideoYoutube {
    switch (videos.get(id)) {
      case (null) { Runtime.trap("Video not found") };
      case (?existing) {
        let updated : VideoYoutube = { id; title; youtubeId; description };
        videos.add(id, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func deleteVideo(id : Nat) : async () {
    if (not videos.containsKey(id)) { Runtime.trap("Video not found") };
    videos.remove(id);
  };

  // Profile
  public query ({ caller }) func getProfile() : async Profile {
    profile;
  };

  public shared ({ caller }) func updateProfile(namaOrganisasi : Text, tagline : Text, deskripsi : Text, visi : Text, misi : Text) : async Profile {
    profile := { namaOrganisasi; tagline; deskripsi; visi; misi };
    profile;
  };

  // Gallery CRUD
  public shared ({ caller }) func createGaleriItem(title : Text, description : Text, mediaUrl : Text, mediaType : Text) : async GaleriItem {
    let id = nextGaleriItemId;
    nextGaleriItemId += 1;
    let item : GaleriItem = {
      id;
      title;
      description;
      mediaUrl;
      mediaType;
      tanggal = Time.now();
    };
    galeriItems.add(id, item);
    item;
  };

  public query ({ caller }) func getAllGaleriItems() : async [GaleriItem] {
    galeriItems.values().toArray();
  };

  public shared ({ caller }) func updateGaleriItem(id : Nat, title : Text, description : Text, mediaUrl : Text, mediaType : Text) : async GaleriItem {
    switch (galeriItems.get(id)) {
      case (null) { Runtime.trap("GaleriItem not found") };
      case (?existing) {
        let updated : GaleriItem = {
          id;
          title;
          description;
          mediaUrl;
          mediaType;
          tanggal = Time.now();
        };
        galeriItems.add(id, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func deleteGaleriItem(id : Nat) : async () {
    if (not galeriItems.containsKey(id)) { Runtime.trap("GaleriItem not found") };
    galeriItems.remove(id);
  };

  // Member Registration
  public shared ({ caller }) func createPendaftaran(nama : Text, nik : Text, alamat : Text, phone : Text, email : Text, pekerjaan : Text, alasan : Text) : async PendaftaranAnggota {
    let id = nextPendaftaranId;
    nextPendaftaranId += 1;
    let pendaftaran : PendaftaranAnggota = {
      id;
      nama;
      nik;
      alamat;
      phone;
      email;
      pekerjaan;
      alasan;
      tanggalDaftar = Time.now();
      status = "pending";
    };
    pendaftaranAnggota.add(id, pendaftaran);
    pendaftaran;
  };

  public query ({ caller }) func getAllPendaftaran() : async [PendaftaranAnggota] {
    pendaftaranAnggota.values().toArray();
  };

  public shared ({ caller }) func updatePendaftaranStatus(id : Nat, status : Text) : async PendaftaranAnggota {
    switch (pendaftaranAnggota.get(id)) {
      case (null) { Runtime.trap("PendaftaranAnggota not found") };
      case (?existing) {
        let updated : PendaftaranAnggota = {
          id = existing.id;
          nama = existing.nama;
          nik = existing.nik;
          alamat = existing.alamat;
          phone = existing.phone;
          email = existing.email;
          pekerjaan = existing.pekerjaan;
          alasan = existing.alasan;
          tanggalDaftar = existing.tanggalDaftar;
          status;
        };
        pendaftaranAnggota.add(id, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func deletePendaftaran(id : Nat) : async () {
    if (not pendaftaranAnggota.containsKey(id)) { Runtime.trap("PendaftaranAnggota not found") };
    pendaftaranAnggota.remove(id);
  };

  // SSK Units CRUD
  public shared ({ caller }) func createSatuanSSK(nama : Text, alamat : Text, phone : Text, email : Text, deskripsi : Text, logoUrl : Text, ketua : Text) : async SatuanSSK {
    let id = nextSatuanId;
    nextSatuanId += 1;
    let satuan : SatuanSSK = { id; nama; alamat; phone; email; deskripsi; logoUrl; ketua };
    satuanSSK.add(id, satuan);
    satuan;
  };

  public query ({ caller }) func getAllSatuanSSK() : async [SatuanSSK] {
    satuanSSK.values().toArray();
  };

  public shared ({ caller }) func updateSatuanSSK(id : Nat, nama : Text, alamat : Text, phone : Text, email : Text, deskripsi : Text, logoUrl : Text, ketua : Text) : async SatuanSSK {
    switch (satuanSSK.get(id)) {
      case (null) { Runtime.trap("SatuanSSK not found") };
      case (?existing) {
        let updated : SatuanSSK = { id; nama; alamat; phone; email; deskripsi; logoUrl; ketua };
        satuanSSK.add(id, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func deleteSatuanSSK(id : Nat) : async () {
    if (not satuanSSK.containsKey(id)) { Runtime.trap("SatuanSSK not found") };
    satuanSSK.remove(id);
  };

  // Site Settings
  public query ({ caller }) func getSiteSettings() : async SiteSettings {
    siteSettings;
  };

  public shared ({ caller }) func updateSiteSettings(logoUrl : Text) : async SiteSettings {
    siteSettings := { logoUrl };
    siteSettings;
  };

  // SliderBanner CRUD
  public shared ({ caller }) func createSliderBanner(title : Text, description : Text, imageUrl : Text, linkUrl : Text, urutan : Nat) : async SliderBanner {
    let id = nextSliderId;
    nextSliderId += 1;
    let banner : SliderBanner = { id; title; description; imageUrl; linkUrl; urutan };
    sliderBanners.add(id, banner);
    banner;
  };

  public query ({ caller }) func getAllSliderBanners() : async [SliderBanner] {
    sliderBanners.values().toArray();
  };

  public shared ({ caller }) func updateSliderBanner(id : Nat, title : Text, description : Text, imageUrl : Text, linkUrl : Text, urutan : Nat) : async SliderBanner {
    switch (sliderBanners.get(id)) {
      case (null) { Runtime.trap("SliderBanner not found") };
      case (?existing) {
        let updated : SliderBanner = { id; title; description; imageUrl; linkUrl; urutan };
        sliderBanners.add(id, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func deleteSliderBanner(id : Nat) : async () {
    if (not sliderBanners.containsKey(id)) { Runtime.trap("SliderBanner not found") };
    sliderBanners.remove(id);
  };

  // Admin principal management
  public shared ({ caller }) func registerAdmin() : async Bool {
    switch (adminPrincipal) {
      case (null) {
        adminPrincipal := ?caller;
        true;
      };
      case (?_) { false };
    };
  };

  public query func getAdminPrincipal() : async ?Principal {
    adminPrincipal;
  };

  public query ({ caller }) func isAdmin() : async Bool {
    switch (adminPrincipal) {
      case (null) { false };
      case (?ap) { ap == caller };
    };
  };

  public shared ({ caller }) func resetAdmin() : async Bool {
    switch (adminPrincipal) {
      case (null) { false };
      case (?ap) {
        if (ap == caller) {
          adminPrincipal := null;
          true;
        } else {
          false;
        };
      };
    };
  };
};
