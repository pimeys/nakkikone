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
    nakkitype_info = NakkitypeInfo.find(params[:nakkitype_info_id])
    nakkitype.nakkitype_info = nakkitype_info

    if nakkitype.save
      reset_nakki_slots(nakkitype, params[:start_time], params[:end_time])
      render :json => nakkitype
    else
      render :status => 500, :text => nakkitype.errors.full_messages
    end
  end

  def new
    current_party = get_current_party
    nakkitype = current_party.nakkitypes.create(:name => 'obsolete-attribute', :nakkitype_info_id => params[:nakkitype_info_id])

    if nakkitype.save
      reset_nakki_slots(nakkitype, params[:start_time], params[:end_time])
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
      params[:start_time].nil? ||
      params[:end_time].nil? ||
      params[:start_time] >= params[:end_time]
  end

  def reset_nakki_slots(nakkitype, start, endz)
    nakkitype.nakkis.clear
    (start..endz).each{ |i| nakkitype.nakkis.create(:slot  => i) }
  end
end
