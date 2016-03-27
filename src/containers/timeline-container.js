import Actions       from '../actions';
import Timeline      from '../components/timeline';
import TwitterClient from '../utils/twitter-client';
import { connect }   from 'react-redux';

const mapStateToProps = (state, props) => {
  let activeAccount = state.accounts[state.activeAccountIndex] || {};
  return {
    active: activeAccount.id_str == props.account.id_str,
  };
}

const mapDispatchToProps = (dispatch, props) => {
  const client = new TwitterClient(props.account);

  return {
    loadHome: () => {
      client.homeTimeline({ count: 50 }, (tweets) => {
        for (let tweet of tweets) {
          dispatch(Actions.addTweet(tweet, props.account));
        }
      });
    },
    loadMentions: () => {
      client.mentionsTimeline((tweets) => {
        for (let tweet of tweets) {
          dispatch(Actions.addTweet(tweet, props.account));
        }
        dispatch(Actions.markAsRead(tweets[0], props.account));
      })
    },
    loadLists: () => {
      client.listsList((lists) => {
        for (let list of lists) {
          dispatch(Actions.setLists(lists, props.account));
        }
      });
    },
    startStreaming: () => {
      dispatch(Actions.startStreaming(props.account));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
