class NakkitypesController < ApplicationController
  skip_before_filter :require_login
  
  def index
    @current_party = get_current_party
    @nakkitypes = @current_party.nakkitypes
    respond_to do |format|
      format.json { render :json => @nakkitypes}
    end
  end

  def update
    @nakkitype = Nakkitype.find(params[:id])
    
    @nakkitype.name = params[:type]
    @nakkitype.nakkis.clear

    (params[:start]..params[:end]).each{ |i|
      @nakkitype.nakkis.create(:slot  => i)
    } 

    if @nakkitype.save
      respond_to do |format|
        format.json { render :json => @nakkitype}
      end
    end
  end

  def new
    @current_party = get_current_party
    @nakkitype = @current_party.nakkitypes.create(:name => params[:type])
    (params[:start]..params[:end]).each{ |i|
      @nakkitype.nakkis.create(:slot  => i)
    } 

    if @nakkitype
      respond_to do |format|
        format.json { render :json => @nakkitype }
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

  def create_nakki_slots
    #TODO reset nakki slots for this nakkitype
    (params[:start]..params[:end]).each{ |i|
      @nakkitype.nakkis.create(:slot  => i)
    } 
  end

  def get_current_party
    Party.find(params[:party_id]);
  end

end
