import Controller from "@ember/controller";
import { computed } from "@ember/object";
import { task, timeout } from "ember-concurrency";
import { set } from "@ember/object";

let songs = {
  heart: {
    title: "Lose Yourself to Dance",
    artist: "Daft Punk",
    albumCover: "",
    trackId: "5CMjjywI0eZMixPeqNd75R"
  },
  poop: {
    title: "Photograph",
    artist: "Nickleback",
    albumCover: "",
    trackId: "3hb2ScEVkGchcAQqrPLP0R"
  },
  sob: {
    title: "Stay With Me",
    artist: "Sam Smith",
    albumCover: "",
    trackId: "5Nm9ERjJZ5oyfXZTECKmRt"
  },
  curse: {
    title: "We're not going to take it",
    artist: "Twisted Sister",
    albumCover: "",
    trackId: "1hlveB9M6ijHZRbzZ2teyh"
  }
};
export default Controller.extend({
  searchResults: [],
  searchTerm: null,
  emojiSong: null,

  songs,

  searchResultsTask: task(function*(searchTerm) {
    set(this, "searchTerm", searchTerm);

    yield timeout(1000);
    let url = `https://api.spotify.com/v1/search?q=${this.searchTerm}&type=track`;
    try {
      let request = yield fetch(url, {
        headers: {
          Authorization:
            "Bearer BQD6bb3nnt9ykZDUT_Zf6bYiSjRKZJxTOuwmd_BDlzA74KQHSRFKZwM9SWp9SFSQxFPxjmjHW_ze1ACfvPo"
        }
      });
      let json = yield request.json();
      let tracks = json.tracks.items;

      // debugger;
      set(this, "results", tracks);
    } catch (e) {
      alert("Error fetching songs!");
      console.log(e);
    }
  }).restartable(),

  claimSongTask: task(function*(params) {
    let profile = this.store.createRecord("profile", params);
    try {
      yield profile.save();
      this.transitionToRoute("success", params.spotifyTrackid);
    } catch (e) {
      alert("There was a problem claiming this song.");
      console.log(e);
    }
  }),

  claimSong(e) {
    e.preventDefault();
    let params = {
      email: this.email
    };

    let song = this.songs[this.emojiSong];

    params.spotifyTrackid = song.trackId;

    this.claimSongTask.perform(params);
  }
});
