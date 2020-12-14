import EmptyList from "../view/no-points.js";
import RouteList from "../view/content-list.js";
import EditingForm from "../view/editing-form.js";
import RoutePoint from "../view/route-point.js";
import EventOffer from "../view/event-offer.js";
import {render, RenderPosition, replace} from "../utils/render";

export default class Point {
  constructor(pointListContainer) {
    this._pointListContainer = pointListContainer;

    this._routeListComponent = new RouteList();
    this._emptyList = new EmptyList();
  }

  init(points) {
    this._points = points.slice();
    this._renderPoint(this._points);
  }

  _renderPointMode(routeList, point) {
    const routePoint = new RoutePoint(point);
    const editRoutePoint = new EditingForm(point);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToPoint();
      }
    };

    const renderFavorite = (point) => {
      point.setClickFavoriteButtonHandler(() => {
        if (point.isFavorite) {
          point.isFavorite = false;
        } else {
          point.isFavorite = true;
        }
        this._renderPoint();
      })
    }

    const replacePointToForm = () => {
      replace(editRoutePoint, routePoint);
      editRoutePoint.setFormSubmitHandler(() => {
        replaceFormToPoint();
      });
      editRoutePoint.setEditClickHandler(() => {
        replaceFormToPoint();
      });
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const replaceFormToPoint = () => {
      editRoutePoint.removeEditClickHandler(() => {
        replaceFormToPoint();
      });
      replace(routePoint, editRoutePoint);
      routePoint.setClickFavoriteButtonHandler(() => {
        if (routePoint.isFavorite) {
          routePoint.isFavorite = false;
      } else {
          routePoint.isFavorite = true;
      }
      this._renderPoint();
    })
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    routePoint.setClickHandler(() => {
      replacePointToForm();
    });

    render(routeList, routePoint, RenderPosition.BEFOREEND);
  }

  _renderEmptyList() {
    render(this._pointListContainer, this._emptyList, RenderPosition.BEFOREEND);
  }

  _renderPoint() {
    if (this._points.length !== 0) {
      render(this._pointListContainer, this._routeListComponent, RenderPosition.BEFOREEND);

      const renderOffers = (point, index) => {
        const offerContainer = this._routeListComponent.getElement().querySelectorAll(`.event__selected-offers`);
        const {extraOffers} = point;
        extraOffers.forEach((offer) => {
          const eventOfferComponent = new EventOffer(offer);
          render(offerContainer[index], eventOfferComponent, RenderPosition.BEFOREEND);
        });
      };

      this._points.forEach((point, index) => {
        this._renderPointMode(this._routeListComponent, point);
        renderOffers(point, index);
      });
    } else {
      this._renderEmptyList();
    }

  }


}
