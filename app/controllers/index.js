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
    title: "We're Not Gonna Take It",
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
            "BQBTMD1of0Vr3s6-eUodMrWxsSZwei8K6IqZn2L4ADa22Otwwd4YdR-o2vvifEDO7k5qrBZQqTrkhFC_9To"
        }
      });
      let json = yield request.json();
      let tracks = json.tracks.items;

      set(this, "results", tracks);
    } catch (e) {
      alert("Error fetching songs!");
      console.log(e);
    }
  }).restartable()
});
