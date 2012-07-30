class PartiesController < ApplicationController
  skip_before_filter :require_login

  def index
    @parties = Party.all 
    respond_to do |format|
      format.json { render :json => @parties}
    end
  end

  def update
    @party = Party.find(params[:id])
    
    @party.title = params[:title]
    @party.description = params[:description]
    @party.date = params[:date]
      
    if @party.save
        respond_to do |format|
        format.json { render :json => @party}
      end
    end
  end

  def new
    @party = Party.new({:title => params[:title], 
                         :description => params[:description], 
                         :date => params[:date]})
    if @party.save
      respond_to do |format|
        format.json { render :json => @party}
      end
    end
  end

  def create
    self.new
  end

  def show
    @party = Party.find(params[:id])
    if @party
      respond_to do |format|
        format.json { render :json => @party}
      end
    end
  end
end
