function saveProgress(){
  const user = auth.currentUser;
  if(!user) return;

  db.collection("students").doc(user.uid).set({
    progress: "updated"
  }, { merge:true });
}