class PartiesController < ApplicationController
  before_filter :admin_access
  skip_before_filter :admin_access, :only => [:show]

  def index
    render :json => Party.all 
  end

  def update
    party = Party.find params[:id]
    if party.update_attributes( :title => params[:title],
                                :description => params[:description],
                                :date => params[:date] )
      render :json => party
    else
      render :status => 500
    end
  end

  def new
    party = Party.new( :title => params[:title], 
                       :description => params[:description], 
                       :date => params[:date] )
    if party.save
      render :json => party
    end
  end

  def create
    self.new
  end

  def show
    party = Party.find(params[:id])
    if party
      render :json => party
    end
  end

  def destroy
    Party.destroy(params[:id])
    render :json => {}
  end
end
