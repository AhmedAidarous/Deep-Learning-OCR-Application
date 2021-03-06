import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Helper from '../../lib/helper';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/Ionicons';

export default Definition = ({def, hideFav}) => {
  const [loadingMp3, setLoadingMp3] = useState(false);
  const [isFav, setIsFav] = useState(false);

  let word = Helper.carefullyGetValue(def, ['word']);
  let orgWord = word;
  if(word.length > 0) {
    word = Helper.capitalize(word);
    word = '[' + word + ']';
  }
  else {
    word = 'Definition not found.'
  }

  let speakMp3 = Helper.carefullyGetValue(def, ['results', '0', 'lexicalEntries', '0', 'entries', '0', 'pronunciations', '0', 'audioFile']);
  
  Helper.isFav(orgWord)
  .then(result => {
    setIsFav(result);
  })
  .catch(err => {
    setIsFav(false);
  });
  
  return(
    <>
      {
        def &&
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.word}>{word}</Text>
            {
              speakMp3.length > 0 &&
              <View>
              {
                loadingMp3 ?
                <ActivityIndicator size="large" color="#7D3C98" style={{marginLeft: 10}} />
                :
                <TouchableOpacity onPress={() => playWord(speakMp3, setLoadingMp3)}>
                  <Text style={styles.speaker}>{'🔈'}</Text>
                </TouchableOpacity>
              }
              </View>
            }
            {
              !hideFav &&
              <View style={{flex: 1, alignItems: "flex-end", paddingRight: 20}}>
                <TouchableOpacity
                  onPress={() => {
                    if(!isFav) {
                      // If not fav, make it as fav
                      Helper.makeFav(orgWord, Helper.getSense(def));
                      setIsFav(true); // Update the isFav state to true
                    }
                    else {
                      // If already fav, remove it.
                      Helper.deleteFav(orgWord);
                      setIsFav(false); // Update the isFav state to false
                    }
                  }} 
                >
                  <Icon name={isFav ? 'ios-heart' : 'ios-heart-empty'} size={26} color={isFav ? 'red' : 'gray'} />
                </TouchableOpacity>
              </View>
            }
          </View>
          
          <View>
            { getLexicalEntries(def) }
          </View>
        </View>
      }
    </>
  );
}

// This is the method that would play the word whenever the button is clicked..
const playWord = (speakMp3, setLoadingMp3) => {
  setLoadingMp3(true);
  console.log('Playing ', speakMp3);
  
  Sound.setCategory('Playback');

  
  var player = new Sound(speakMp3, null, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      setLoadingMp3(false);
      return;
    }
    
    // Sets the initial volume to 1..
    player.setVolume(1);

    // Play the sound with an onEnd callback
    player.play((success) => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
      setLoadingMp3(false);
      player.release();
    });
  });
}

// Simply iterates through the API response, and get the lexicalEntries, which are used in the display
// of the word definition..
const getLexicalEntries = (def) => {
  const jsxEntries = [];
  var lexicalEntries = null;

  if(Helper.isNotNullAndUndefined(def, ['results', '0', 'lexicalEntries'])) {
    lexicalEntries = def.results[0].lexicalEntries;

    lexicalEntries.forEach((lexicalItem, index) => {
      jsxEntries.push(
        <View key={'lexicalEntry_' + index} style={styles.lexicalContent}>
          <Text style={styles.category}>{Helper.carefullyGetValue(lexicalItem, ['lexicalCategory','text'], '')}</Text>
          { 
            Helper.isNotNullAndUndefined(lexicalItem, ['entries', '0', 'senses']) &&
            getSenses(lexicalItem.entries[0].senses) 
          }
        </View>
      );
    });
  }

  return (
    <>
      {jsxEntries}
    </>
  );
}


const getSenses = (senses) => {
  const jsxSenses = [];
  
  if(senses && senses.length > 0) {
    senses.forEach((sense, index) => {
      let example = Helper.carefullyGetValue(sense, ['examples', '0', 'text'], '');
      if(example.length > 0)
        example = 'E.g. ' + example;

      if(sense.definitions) { // Only if sense have definition
        jsxSenses.push(
          <View style={styles.row} key={'sense_' + index}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <View style={styles.column}>
              <Text style={styles.definition}>{Helper.carefullyGetValue(sense, ['definitions', '0'], '')}</Text>
              <Text style={styles.example}>{example}</Text>
            </View>
          </View>
        );
      }
    });
  }

  return (
    <View style={{marginLeft: 10}}>{jsxSenses}</View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 30
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  speaker: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10
  },
  lexicalContent: {
    paddingTop: 20
  },
  category: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  column: {
    flex: 1,
    flexDirection: 'column'
  },
  bullet: {
    maxWidth: 20,
    minWidth: 20,
    fontSize: 20,
    fontWeight: 'bold'
  },
  definition: {
    fontSize: 18,
    fontWeight: 'normal'
  },
  example: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#999999',
    marginBottom: 10
  }
});
