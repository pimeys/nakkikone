class PartiesController < ApplicationController
  before_filter :admin_access
  skip_before_filter :admin_access, :only => [:show, :index]

  def index
    render :json => Party.all, :root => false
  end

  def update
    party = Party.find params[:id]
    if party.update_attributes( :title => params[:title],
                                :description => params[:description],
                                :date => params[:date],
                                :info_date => params[:infoDate])
      render :json => party
    else
      render :status => 400, :json => party.errors
    end
  end

  def new
    party = Party.new( :title => params[:title], 
                       :description => params[:description], 
                       :date => params[:date],
                       :info_date => params[:infoDate])
    if party.save
      render :json => party
    else
      render :status => 400, :json => party.errors
    end
  end

  def create
    self.new
  end

  def show
    party = nil;
    if (params[:by_title])
      party = Party.where(:title => params[:id]).first
    else
      party = Party.find(params[:id])
    end

    if party
      render :json => party
    else
      render :status => 404, :text => "not found"
    end
  end

  def destroy
    Party.destroy(params[:id])
    render :json => {}
  end
end
