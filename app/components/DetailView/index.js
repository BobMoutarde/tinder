import React, { PropTypes } from 'react';
import ImageGallery from 'react-image-gallery';

import { getAge, parsePingTime } from 'utils/operations';
import { getFacebookUrl, getFacebookPicture } from 'utils/facebook';

import styles from './styles.css';
import Icon from 'components/Icon';
import Text from 'components/Text';
import Button from 'components/Button';

const buttonMapping = [
  'pass', 'superlike', 'like',
];

class DetailView extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.imageData.length === 0) {
      return;
    }

    if (this.props.imageData.length !== 0) {
      if (this.props.imageData[0].original !== nextProps.imageData[0].original) {
        this.imageGallery.slideToIndex(0);
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!this.props.data) return true;
    if (this.props.data._id !== nextProps.data._id) return true; // eslint-disable-line no-underscore-dangle
    return false;
  }

  handleClickNext() {
    const nextIndex = this.imageGallery.getCurrentIndex() + 1;
    if (this.props.imageData[nextIndex]) {
      this.imageGallery.slideToIndex(nextIndex);
    } else {
      this.imageGallery.slideToIndex(0);
    }
  }


  renderButtons({ _id, content_hash, name }, onClickButton) {
    return (
      <div className={styles.detailViewContainerButtons}>
      {buttonMapping.map((each) => <Button key={each} type={each} details={{ name }} onClick={onClickButton} id={_id} hash={content_hash}></Button>)}
      </div>
    );
  }

  render() {
    const age = getAge(this.props.data.birth_date);
    const jobs = this.props.data.jobs && this.props.data.jobs[0];
    const schools = this.props.data.jobs && this.props.data.schools[0];
    const instagramData = this.props.data.instagram;
    const hasPhotos = this.props.data.photos.length !== 0;

    return (
      <div className={styles.detailViewContainer} >
        <div className={styles.detailViewContainer_mainPicture}>
        {hasPhotos ?
          <ImageGallery
            ref={i => { this.imageGallery = i; }}
            defaultImage={this.props.data.photos[0].url}
            items={this.props.imageData}
            showThumbnails={true}
            showNav={true}
            startIndex={0}
            onClick={(e) => this.handleClickNext(e)}
            lazyLoad
            renderItem={(item) => <div key={item.original} style={{ backgroundImage: `url(${item.original})`, height: 520, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />}
          /> : null}
        </div>
        <div className={styles.detailViewContainer_content}>
          <div className={styles.detailViewContainer_contentName}>
            <Text type="name" style={{ color: 'black' }}>{this.props.data.name}</Text>
            {instagramData ? <a href={`https://instagram.com/${instagramData.username}`} target="_blank" style={{ color: 'black' }} ><Icon type="instagram" style={{ marginTop: 5, marginLeft: 5, float: 'right' }} /></a> : null}
            {this.props.isPotentialLike ? <Text type="potentialLike">Potential Like!</Text> : null}
          </div>
          <div>
            <Text type="age" style={{ color: 'black' }}>{age}</Text>
            <Text type="lastActive">{parsePingTime(this.props.data.ping_time)}</Text>
          </div>
          <Text type="school">{schools && schools.name}</Text>
          <Text type="jobs">{(jobs && jobs.title) && jobs.title.name}{(jobs && jobs.title) && jobs.company ? ' at ' : null}{jobs && jobs.company && <a href={jobs.company.id} target="_blank">{jobs.company.name}</a>}</Text>
          <Text type="bio">{this.props.data.bio}</Text>

          {this.props.data.common_connections && this.props.data.common_connections.length > 0 ?
            <div>
              <Text type="profileHeader">Common Connections</Text>
              <div className={styles.commonConnectionsContainer}>
            {this.props.data.common_connections.map((each) => (
              <div className={styles.connectionItem} key={each.id}>
                <a
                  href={getFacebookUrl(each.id)}
                  target="_blank"
                >
                  <div
                    key={each.id}
                    style={{ backgroundImage: `url(${getFacebookPicture(each.id)})` }}
                    className={styles.connectionImage}
                  />
                </a>
                <Text type="connectionName">{each.name || 'Friend'}</Text>
              </div>
            ))}
              </div>
            </div> : null}
          {this.props.data.common_interests && this.props.data.common_interests.length > 0 ?
            <div className={styles.commonInterestsWrapper}>
              <Text type="profileHeader">Common Interests</Text>
              <div className={styles.commonInterestsContainer}>
                {this.props.data.common_interests.map((each) => (
                  <a
                    key={each.id}
                    href={getFacebookUrl(each.id)}
                    target="_blank"
                    className={styles.commonInterestsLink}
                  >
                    <Text type="commonInterest">{each.name}</Text>
                  </a>
                  ))}
              </div>
            </div> : null}
        </div>
      </div>
    );
  }
}

DetailView.propTypes = {
  imageData: PropTypes.array,
  data: PropTypes.object,
  hasMatches: PropTypes.bool,
  isFetching: PropTypes.bool,
  isPotentialLike: PropTypes.bool,
  recommendationView: PropTypes.bool,
};


export default DetailView;
