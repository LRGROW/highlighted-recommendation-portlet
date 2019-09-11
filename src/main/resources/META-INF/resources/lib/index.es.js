import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import ReactResizeDetector from 'react-resize-detector';

import GrowCard from './modules/GrowCard.es';

const mockupData = {
			articleAuthor: "Author 01",
			authorAvatar: "/o/HighlightedRecommendationPortlet/images/0.jpeg",
			createDate: "01.01.2019",
			articleTitle: "Title 01",
			articleContent: "",
			tags: ["badge", "gamification", "respect", "test1", "test2"],
			readCount: "626",
			articleCategory: "Share"
		};

class App extends React.Component {
	
	constructor(props) {
		super(props);
		
		const GROUP_ID = Liferay.ThemeDisplay.getCompanyGroupId();
		const USER_ID = Liferay.ThemeDisplay.getUserId();

		this.SPRITEMAP = Liferay.ThemeDisplay.getPathThemeImages();
		this.PORTAL_URL = Liferay.ThemeDisplay.getCDNBaseURL();

		this.GET_HIGHLIGHTED_QUERY = "/o/favourites/getContent?assetEntryId=";
		this.ADD_TO_MYFAVOURITES_QUERY = this.PORTAL_URL + "/o/favourites/addFavourite?groupId=" + GROUP_ID + "&userId=" + USER_ID + "&assetEntryId=";

		this.REMOVE_FROM_MYFAVOURITES_QUERY = this.PORTAL_URL + "/o/favourites/removeFavourite?groupId=" + GROUP_ID + "&userId=" + USER_ID + "&assetEntryId=";
		this.GET_ISFAVOURITE_AND_LIKED_ARRAY = this.PORTAL_URL + "/o/favourites/isFavouriteAndLikedArray?groupId="+ GROUP_ID + "&userId=" + USER_ID + "&assetEntryId=";

		this.ADD_ASSET_LIKE = this.PORTAL_URL + "/o/favourites/addAssetLike?userId=" + USER_ID + "&assetEntryId=";
		this.REMOVE_ASSET_LIKE = this.PORTAL_URL + "/o/favourites/removeAssetLike?&userId=" + USER_ID + "&assetEntryId=";

		this.RECOMMENDATION_TOGGLE_LIKE_EVENT = 'recommendationToggleLikeEvent'
		this.RECOMMENDATION_TOGGLE_STAR_EVENT = 'recommendationToggleStarEvent';
		this.FAVOURITES_TOGGLE_STAR_EVENT = 'favouritesToggleStarEvent';
		this.HIGLIGHTED_TOGGLE_STAR_EVENT = 'highlightedToggleStarEvent';

		this.state = {
			articleAuthor: "",
			articleCategory: "",
			articleTitle: "",
			authorAvatar: "",
			content: "",
			createDate: "",
			data: {},
			id: "",
			readCount: "",
			tags: [],
			star: false,
			like: false,
			isLoading: true,
			error: null,
		};

		let instance = this;

		Liferay.on(
			this.RECOMMENDATION_TOGGLE_LIKE_EVENT,
			function(event) {
				if(event && event.data) {
					instance.toggleLike(event.data);
				}
			}
		);

		Liferay.on(
			this.FAVOURITES_TOGGLE_STAR_EVENT,
			function(event) {
				if(event && event.data) {
					instance.toggleStar(event.data);
				}
			}
		);

		Liferay.on(
			this.RECOMMENDATION_TOGGLE_STAR_EVENT,
			function(event) {
				if(event && event.data) {
					instance.toggleStar(event.data);
				}
			}
		);

		this.handleStarClick = this.handleStarClick.bind(this);
		this.handleLikeClick = this.handleLikeClick.bind(this);
		this.fireToggleStarEvent = this.fireToggleStarEvent.bind(this);
		this.toggleLike = this.toggleLike.bind(this);
		this.toggleStar = this.toggleStar.bind(this);
	}

	fireToggleLikeEvent(data) {
		Liferay.fire(
			this.RECOMMENDATION_TOGGLE_LIKE_EVENT,
			{
				data: data,
				isLoading: false
			}
		);
	}

	fireToggleStarEvent(data) {
		Liferay.fire(
			this.RECOMMENDATION_TOGGLE_STAR_EVENT,
			{
				data: data,
				isLoading: false
			}
		);
	}

	async handleStarClick(data) {
		if (data && !this.state.isLoading) {
						
			let query = null;
			
			if (data.star) {
				query = this.ADD_TO_MYFAVOURITES_QUERY + data.id;
				
				await axios.put(query)
					.then(
						response => {
							this.fireToggleStarEvent(data);
						}
					)
					.catch(error => {
						this.setState({ error: error, isLoading: false });
						Liferay.Util.openToast(
							{
								message: error,
								title: Liferay.Language.get('error'),
								type: 'danger'
							}
						);
					});
				}
				else {
					query = this.REMOVE_FROM_MYFAVOURITES_QUERY + data.id;

					await axios.delete(query)
					.then(
						response => {
							this.fireToggleStarEvent(data);
						}
					)
					.catch(error => {
						this.setState({ error: error, isLoading: false });
						Liferay.Util.openToast(
							{
								message: error,
								title: Liferay.Language.get('error'),
								type: 'danger'
							}
						);
					});
				}
		}
	}

	async handleLikeClick(data) {
		if (data && !this.state.isLoading) {		
			let query = null;
	
			if (data.like) {
				query = this.ADD_ASSET_LIKE + data.id;
				
				await axios.put(query)
					.then(
						response => {
							this.fireToggleLikeEvent(data);
						}
					)
					.catch(error => {
						this.setState({ error: error, isLoading: false });
						Liferay.Util.openToast(
							{
								message: error,
								title: Liferay.Language.get('error'),
								type: 'danger'
							}
						);
					});
				}
				else {
					query = this.REMOVE_ASSET_LIKE + data.id;

					await axios.delete(query)
					.then(
						response => {
							this.fireToggleLikeEvent(data);
						}
					)
					.catch(error => {
						this.setState({ error: error, isLoading: false });
						Liferay.Util.openToast(
							{
								message: error,
								title: Liferay.Language.get('error'),
								type: 'danger'
							}
						);
					});
				}
		}
		
	}
	
	toggleLike(data) {
		if (data.id === this.state.id) {
			this.setState({
				like: data.like,
				isLoading: false
			})
		}
	}
	
	toggleStar(data) {
		if (data.id === this.state.id) {
			this.setState({
				star: data.star,
				isLoading: false
			})
		}
	}
	
	async componentDidMount() {
		if (this.props.articleToRecommend) {
			this.setState({ isLoading: true });
	
			await axios.get(this.GET_HIGHLIGHTED_QUERY + this.props.articleToRecommend)
			.then(response => {
				let data = response.data
				this.setState({
					articleAuthor: data.articleAuthor,
					articleCategory: data.articleCategory,
					articleTitle: data.articleTitle,
					authorAvatar: data.authorAvatar,
					articleContent: data.content,
					createDate: data.createDate,
					id: data.id,
					readCount: data.readCount,
					tags: data.tags
				})

				axios.get(this.GET_ISFAVOURITE_AND_LIKED_ARRAY + this.props.articleToRecommend)
				.then(response => {
					this.setState({
						star: response.data[this.props.articleToRecommend][0].favourite,
						like: response.data[this.props.articleToRecommend][0].liked,
						isLoading: false
					})
				})
				.catch(error => {
					this.setState({ error: error, isLoading: false });
					Liferay.Util.openToast(
						{
							message: error,
							title: Liferay.Language.get('error'),
							type: 'danger'
						}
					);
				})
			})
			.catch(error => {
				this.setState({ error: error.message, isLoading: false });
				Liferay.Util.openToast(
					{
						message: error.message,
						title: Liferay.Language.get('error'),
						type: 'danger'
					}
				);
			});
		}
	}

	render() {

		const { isLoading, error } = this.state;

		return (
			<div className="highlighted-recommendation-portlet">
				<div className="container">
					{this.props.articleToRecommend == "" ? (
						<div className="row">
							<div className="col-xl-4">
								<div className="higlighted-recommendation-porltet-left-panel">
									<h1 className="highlighted">
										Configure the Portlet in order to Highlight an Article!
									</h1>

									<div className="text-secondary strong">
										Type in the assetEntryId of the article in the Portlet configuration
									</div>
								</div>
							</div>

							<div className="col-xl-8">
								<div className="loading-indicator">
									<span aria-hidden="true" className="loading-animation"></span>
								</div>
							</div>
						</div>
					) : (
						<div className="row">
							<div className="col-xl-4">
								<div className="higlighted-recommendation-porltet-left-panel">
									<h1 className="highlighted">
										Highlighted
									</h1>

									<div className="text-secondary strong">
										Newest article recommended for you <br />
										from the {this.state.articleCategory} category
									</div>
								</div>
							</div>
							<div
								className={
									"col-xl-8 " + this.state.articleCategory.toLowerCase() + "-backgroundcolor"
								} 
							>
								{isLoading && (
									<div className="loading-indicator">
										<span aria-hidden="true" className="loading-animation"></span>
									</div>
								)}

								<ReactResizeDetector handleWidth onResize={this.onResize} />
							
								<div className="highligted-card">
									<GrowCard
										spritemap={this.SPRITEMAP}
										portalUrl={this.PORTAL_URL}
										handleStarClick={this.handleStarClick}
										handleLikeClick={this.handleLikeClick}
										articleAuthor={this.state.articleAuthor}
										articleAuthorAvatar={this.state.authorAvatar}
										articleCreateDate={this.state.createDate}
										articleTitle={this.state.articleTitle}
										articleContent={this.state.articleContent}
										articleTags={this.state.tags}
										articleReadCount={this.state.readCount}
										articleCategory={this.state.articleCategory}
										like={this.state.like ? this.state.like : false}
										star={this.state.star ? this.state.star : false}
										id={this.state.id}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default function(elementId, articleToRecommend) {
	ReactDOM.render(<App articleToRecommend={articleToRecommend} />, document.getElementById(elementId));
}