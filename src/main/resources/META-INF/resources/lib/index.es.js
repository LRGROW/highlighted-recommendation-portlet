import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import ReactResizeDetector from 'react-resize-detector';

import GrowCard from './modules/GrowCard.es';

const GROUP_ID = Liferay.ThemeDisplay.getCompanyGroupId();
const USER_ID = Liferay.ThemeDisplay.getUserId();

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
		
		this.SPRITEMAP = Liferay.ThemeDisplay.getPathThemeImages();
		this.PORTAL_URL = Liferay.ThemeDisplay.getCDNBaseURL();

		this.API = this.PORTAL_URL + "/o/favourites"; 
		this.GET_HIGHLIGHTED_QUERY = this.API + "/getFavourites?groupId="+ GROUP_ID + "&userId=" + USER_ID;
		this.ADD_TO_MYFAVOURITES_QUERY = this.PORTAL_URL + "/o/favourites/" + "/addFavourite?groupId=" + GROUP_ID + "&userId=" + USER_ID + "&assetEntryId=";
		this.REMOVE_FROM_MYFAVOURITES_QUERY = this.PORTAL_URL + "/o/favourites/" + "/removeFavourite?groupId=" + GROUP_ID + "&userId=" + USER_ID + "&assetEntryId=";

		this.RECOMMENDATION_TOGGLE_LIKE_EVENT = 'revommendationToggleLikeEvent'
		this.RECOMMENDATION_TOGGLE_STAR_EVENT = 'recommendationtoggleStarEvent';
		this.FAVOURITES_TOGGLE_STAR_EVENT = 'favouritesToggleStarEvent';
		this.HIGLIGHTED_TOGGLE_STAR_EVENT = 'highlightedToggleStarEvent';

		this.state = {
			data: {},
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
			this.RECOMMENDATION_TOGGLE_STAR_EVENT,
			function(event) {
				if(event && event.data) {
					instance.toggleStar(event.data);
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
	
		this.handleStarClick = this.handleStarClick.bind(this);
		this.handleLikeClick = this.handleLikeClick.bind(this);
		this.fireToggleStarEvent = this.fireToggleStarEvent.bind(this);
		this.toggleLike = this.toggleLike.bind(this);
		this.toggleStar = this.toggleStar.bind(this);
	}
	
	fireToggleStarEvent(data) {
		Liferay.fire(
			HIGLIGHTED_TOGGLE_STAR_EVENT,
			{
				data: data,
				isLoading: false
			}
		);
	}
	
	async handleStarClick(data) {

		if (data && !this.state.isLoading) {
			this.setState({ isLoading: true });
				
			let query = null;
			
			if (data.star) {
				query = this.ADD_TO_MYFAVOURITES_QUERY + data.id;
				
				await axios.put(query)
					.then(
						response => {
							const newData = this.state.data.map(card =>
								card.id === data.id
								? Object.assign(card, {star: data.star})
								: card
							);
														
							this.setState({
								data: newData,
								isLoading: false
							});
		
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
							const newData = this.state.data.map(card =>
								card.id === data.id
								? Object.assign(card, {star: data.star})
								: card
							);
														
							this.setState({
								data: newData,
								isLoading: false
							});
		
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
			this.setState({ isLoading: true });
				
			let query = null;
			
			if (data.like) {
				query = this.ADD_ASSET_LIKE + data.id;
				
				await axios.put(query)
					.then(
						response => {
							const newData = this.state.data.map(card =>
								card.id === data.id
								? Object.assign(card, {like: data.like})
								: card
							);
														
							this.setState({
								data: newData,
								isLoading: false
							});

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
							const newData = this.state.data.map(card =>
								card.id === data.id
								? Object.assign(card, {like: data.like})
								: card
							);
														
							this.setState({
								data: newData,
								isLoading: false
							});

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
		if (data) {
			this.setState({ isLoading: true });
		
			const newData = this.state.data.map(card =>
				card.id === data.id
				? Object.assign(card, {like: data.like})
				: card
			);
			
			this.setState({
				data: newData,
				isLoading: false
			});
		}
	}
	
	toggleStar(data) {
		
		if (data) {
			this.setState({ isLoading: true });
		
			const newData = this.state.data.map(card =>
				card.id === data.id
				? Object.assign(card, {star: data.star})
				: card
			);
			
			this.setState({
				data: newData,
				isLoading: false
			});
		}
	}
	
	async componentDidMount() {
		this.setState({ isLoading: true });
		
		console.log("componentDidMount");
		
		this.setState({
			data: mockupData,
			isLoading: false
		});

		/*await axios.get(this.GET_HIGHLIGHTED_QUERY)
		.then(response => {
			this.setState({
				data:  Object.assign({}, response.data),
				isLoading: false
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
		});*/
	}

	render() {

		const { data, isLoading, error } = this.state;

		return (
			<div className="highlighted-recommendation-portlet">
				<div className="container">
				  <div className="row">
					<div className="col-xl-4">
					
						<div className="higlighted-recommendation-porltet-left-panel">
							<h1 className="highlighted">
								Highlighted
							</h1>

							<div className="text-secondary strong">
								Newest article recommended for you <br />
								from the Excellence category
							</div>
						</div>
						
					</div>

					{isLoading ? (
					
						<div className="col-xl-8">
					
							<div className="loading-indicator">
								<span aria-hidden="true" className="loading-animation"></span>
							</div>
						
						</div>
						
					) : (
					
						<div
							className={
								"col-xl-8 " + data.articleCategory.toLowerCase() + "-backgroundcolor"
							 } 
						>

							<ReactResizeDetector handleWidth onResize={this.onResize} />
						
							<div className="highligted-card">
								<GrowCard
									spritemap={this.SPRITEMAP}
									portalUrl={this.PORTAL_URL}
									cardData={data}
									handleStarClick={this.handleStarClick}
									handleLikeClick={this.handleLikeClick}
									articleAuthor={data.articleAuthor}
									articleAuthorAvatar={data.authorAvatar}
									articleCreateDate={data.createDate}
									articleTitle={data.articleTitle}
									articleContent={data.articleContent}
									articleTags={data.tags}
									articleReadCount={data.readCount}
									articleCategory={data.articleCategory}
									like={data.like ? data.like : false}
									star={data.star ? data.star : false}
									id={data.id}
								/>
							</div>
						</div>
					)}
				
					</div>
				</div>
			</div>
		);
	}
}

export default function(elementId, articleToRecommend) {
	ReactDOM.render(<App articleToRecommend={articleToRecommend} />, document.getElementById(elementId));
}