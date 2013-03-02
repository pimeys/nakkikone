class NakkitypesController < ApplicationController
  before_filter :admin_access

  def index
    current_party = get_current_party
    nakkitypes = current_party.nakkitypes
    render :json => nakkitypes, :root => false
  end

  def update
    nakkitype = Nakkitype.find(params[:id])
    
    nakkitype.name = params[:type]
    nakkitype.nakkis.clear

    (params[:start]..params[:end]).each{ |i| nakkitype.nakkis.create(:slot  => i) } 

    if nakkitype.save
      render :json => nakkitype
    end
  end

  def new
    current_party = get_current_party
    nakkitype = current_party.nakkitypes.create(:name => params[:type])
    (params[:start]..params[:end]).each{ |i| nakkitype.nakkis.create(:slot  => i) } 

    if nakkitype
      render :json => nakkitype
    end
  end

  def create
    self.new
  end

  def destroy
    current_party = get_current_party
    current_party.nakkitypes.destroy(params[:id])
    render :json => {}
  end

  def create_nakki_slots
    #TODO reset nakki slots for this nakkitype
    (params[:start]..params[:end]).each{ |i| nakkitype.nakkis.create(:slot  => i) } 
  end

  def get_current_party
    Party.find(params[:party_id]);
  end
end
