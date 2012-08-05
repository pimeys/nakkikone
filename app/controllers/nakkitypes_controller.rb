class NakkitypesController < ApplicationController
  skip_before_filter :require_login
  
  def index
    @current_party = Party.find(params[:party_id])
    @nakkitypes = @current_party.nakkitypes
    respond_to do |format|
      format.json { render :json => @nakkitypes}
    end
  end

  def update
    @nakkitype = Nakkitype.find(params[:id])
    
    @nakkitype.name = params[:type]
    @nakkitype.starttime = params[:start]
    @nakkitype.endtime = params[:end]
    
    @nakkitype.nakkis.clear

    (0..5).each{ |i|
      @nakkitype.nakkis.create(:slot  => i)
    } 

    if @nakkitype.save
      respond_to do |format|
        format.json { render :json => @nakkitype}
      end
    end
  end

  def new
    @current_party = Party.find(params[:party_id])
    @nakkitype = @current_party.nakkitypes.create({:name => params[:type],
                                                    :starttime => params[:start],
                                                    :endtime => params[:end]})
    (0..5).each{ |i|
      @nakkitype.nakkis.create(:slot  => i)
    } 

    if @nakkitype
      respond_to do |format|
        format.json { render :json => @nakkitype}
      end
    end
  end

  def create
    self.new
  end

  def destroy
    @current_party = get_current_party
    @current_party.nakkitypes.destroy(params[:id])
    respond_to do |format|
      format.json { render :json => {}}
    end
  end

  def get_current_party
    Party.find(params[:party_id]);
  end

end
