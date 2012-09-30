class PartiesController < ApplicationController

  def index
    render :json => Party.all 
  end

  def update
    party = Party.find(params[:id])
    
    party.title = params[:title]
    party.description = params[:description]
    party.date = params[:date]
      
    if party.save
      render :json => party
    end
  end

  def new
    party = Party.new({:title => params[:title], 
                         :description => params[:description], 
                         :date => params[:date]})
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
