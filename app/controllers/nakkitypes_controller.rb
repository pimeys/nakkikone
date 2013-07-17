class NakkitypesController < ApplicationController
  before_filter :admin_access
  before_filter :validate_start_end_range, :only => [:update, :new]

  def index
    current_party = get_current_party
    nakkitypes = current_party.nakkitypes
    render :json => nakkitypes, :root => false
  end

  def update
    nakkitype = Nakkitype.find(params[:id])
    nakkitype.name = params[:type]

    reset_nakki_slots(nakkitype, params[:start], params[:end])

    if nakkitype.save
      render :json => nakkitype
    else
      render :status => 500, :text => nakkitype.errors.full_messages
    end
  end

  def new
    current_party = get_current_party
    nakkitype = current_party.nakkitypes.create(:name => params[:type])

    reset_nakki_slots(nakkitype, params[:start], params[:end])

    if nakkitype
      render :json => nakkitype
    else
      render :status => 500, :text => nakkitype.errors.full_messages
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

  def validate_start_end_range
    render :status => 400, :json => {:message => "start/end range validation failed, must be start < end."} if 
      params[:start].nil? ||
      params[:end].nil? ||
      params[:start] >= params[:end]
  end

  def reset_nakki_slots(nakkitype, start, endz)
    nakkitype.nakkis.clear
    (start..endz).each{ |i| nakkitype.nakkis.create(:slot  => i) } 
  end
end
