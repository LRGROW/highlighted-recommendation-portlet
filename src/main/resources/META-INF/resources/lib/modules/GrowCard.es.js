import React from "react";
import GrowIcon from "./GrowIcon.es";
import GrowCardFooter from "./GrowCardFooter.es.js";
import TextTruncate from "react-text-truncate";

class GrowCard extends React.Component {
  constructor(props) {
    super(props);

    this._handleLikeClicked = this._handleLikeClicked.bind(this);
    this._handleStarClick = this._handleStarClick.bind(this);
  }

  _handleStarClick() {
    let card = Object.assign({}, {
      articleAuthor: this.props.articleAuthor,
      authorAvatar: this.props.articleAuthorAvatar,
      createDate: this.props.articleCreateDate,
      articleTitle: this.props.articleTitle,
      articleContent: this.props.articleContent,
      articleTags: this.props.articleTags,
      articleReadCount: this.props.articleReadCount,
      articleCategory: this.props.articleCategory,
      like: this.props.like,
      star: !this.props.star,
      id: this.props.id
    });

    this.props.handleStarClick(card);
  }

  _handleLikeClicked() {
    let card = Object.assign({}, {
      articleAuthor: this.props.articleAuthor,
      authorAvatar: this.props.articleAuthorAvatar,
      createDate: this.props.articleCreateDate,
      articleTitle: this.props.articleTitle,
      articleContent: this.props.articleContent,
      articleTags: this.props.articleTags,
      articleReadCount: this.props.articleReadCount,
      articleCategory: this.props.articleCategory,
      like: !this.props.like,
      star: this.props.star,
      id: this.props.id
    });

    this.props.handleLikeClick(card);
  }

  render() {
    return (
      <div
        className={
          "grow-card card card-" +
          this.props.articleCategory.toLowerCase() +
          " mx-1"
        }
      >
        <div className="card-body">
          <div className="autofit-row autofit-padded">
            <div className="autofit-col">
              <div className="autofit-section">
                <img
                  alt="Author's thumbnail"
                  className="img-fluid sticker sticker-primary sticker-xl rounded-circle"
                  src={this.props.articleAuthorAvatar}
                />
              </div>
            </div>
            <div className="autofit-col autofit-col-expand">
              <div className="autofit-section text-secondary">
                <span className="grow-author">{this.props.articleAuthor}</span>
                <p className="grow-create-date">
                  {this.props.articleCreateDate ? this.props.articleCreateDate : ""}
                </p>
              </div>
            </div>
            <div className="autofit-col">
              <div className="autofit-section">
                <button
                  className="btn btn-outline-secondary btn-outline-borderless"
                  type="button"
                  onClick={this._handleStarClick}
                >
                  {this.props.star && (
                    <GrowIcon
                      spritemap={this.props.spritemap}
                      classes="lexicon-icon inline-item"
                      iconName="star"
                    />
                  )}
                  {this.props.star == false && (
                    <GrowIcon
                      spritemap={this.props.spritemap}
                      classes="lexicon-icon inline-item"
                      iconName="star-o"
                    />
                  )}
                </button>

                <button
                  className="btn btn-outline-secondary btn-outline-borderless"
                  type="button"
                  onClick={this._handleLikeClicked}
                >
                  {this.props.like && (
                    <GrowIcon
                      spritemap={this.props.spritemap}
                      classes="lexicon-icon thumbs-up-liked"
                      iconName="thumbs-up"
                    />
                  )}
                  {this.props.like == false && (
                    <GrowIcon
                      spritemap={this.props.spritemap}
                      classes="lexicon-icon thumbs-up"
                      iconName="thumbs-up"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="autofit-row autofit-padded">
            <div className="autofit-col autofit-col-expand grow-card-article">
              <div className="autofit-section">
                <a
                  href={
                    this.props.portalUrl +
                    "/" +
                    this.props.articleCategory +
                    "/" +
                    this.props.articleTitle
                      .split(" ")
                      .join("+")
                      .toLowerCase()
                  }
                >
                  <h3 className="grow-title">
                    <TextTruncate
                      line={2}
                      truncateText="…"
                      text={this.props.articleTitle ? this.props.articleTitle : ""}
                    />
                  </h3>
                </a>
              </div>
              <div className="autofit-section">
                <div className="text-secondary grow-card-content">
                  {this.props.articleContent ? (
                  <TextTruncate
                    line={3}
                    truncateText="…"
                    text={this.props.articleContent.replace(/(<([^>]+)>)/ig,"")}
                  />) :
                  ""}
                </div>
              </div>
            </div>
          </div>

          <GrowCardFooter
            articleTags={this.props.articleTags}
            spritemap={this.props.spritemap}
            articleReadCount={this.props.articleReadCount}
            articleCategory={this.props.articleCategory}
          />
        </div>
      </div>
    );
  }
}

export default GrowCard;
